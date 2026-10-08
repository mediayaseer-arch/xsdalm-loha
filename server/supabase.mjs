import { createClient } from "@supabase/supabase-js";
import WebSocket from "ws";
import fs from "node:fs";
import path from "node:path";

function normalizeSupabaseUrl(value) {
  const trimmed = String(value || "")
    .trim()
    .replace(/^['"]|['"]$/g, "");

  const embeddedUrl = trimmed.match(/https?:\/\/[^\s"'`]+/i)?.[0];
  if (embeddedUrl) return embeddedUrl;

  const embeddedHost = trimmed.match(
    /([a-z0-9-]+\.supabase\.co(?:\/[^\s"'`]*)?)/i,
  )?.[1];
  if (embeddedHost) return `https://${embeddedHost}`;

  const projectReference = trimmed.match(/\b([a-z0-9]{20})\b/i)?.[1];
  if (projectReference) {
    return `https://${projectReference}.supabase.co`;
  }

  return "";
}

const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const supabaseServiceRoleKey =
  process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const DATA_FILE_PATH = path.join(process.cwd(), "server", "data-store.json");

class MemoryStore {
  constructor() {
    this.tables = new Map();
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(DATA_FILE_PATH)) {
        const raw = fs.readFileSync(DATA_FILE_PATH, "utf8");
        const parsed = JSON.parse(raw);
        for (const [tableName, rows] of Object.entries(parsed)) {
          const map = new Map();
          for (const [k, v] of Object.entries(rows)) {
            map.set(k, v);
          }
          this.tables.set(tableName, map);
        }
      }
    } catch (e) {
      console.warn("[MemoryStore loadFromFile error]", e);
    }
  }

  saveToFile() {
    try {
      const obj = {};
      for (const [tableName, map] of this.tables.entries()) {
        obj[tableName] = Object.fromEntries(map.entries());
      }
      fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(obj, null, 2), "utf8");
    } catch (e) {
      console.warn("[MemoryStore saveToFile error]", e);
    }
  }

  getTable(name) {
    if (!this.tables.has(name)) {
      this.tables.set(name, new Map());
    }
    return this.tables.get(name);
  }

  from(tableName) {
    const table = this.getTable(tableName);
    const storeInstance = this;
    return {
      select(_fields) {
        const query = {
          eq(col, val) {
            return {
              async maybeSingle() {
                const record = table.get(val);
                return { data: record || null, error: null };
              },
            };
          },
          order(_col, _opts) {
            return query;
          },
          limit(_n) {
            return query;
          },
          then(resolve, reject) {
            const list = Array.from(table.values());
            return Promise.resolve({ data: list, error: null }).then(resolve, reject);
          },
        };
        return query;
      },
      async upsert(row, _options) {
        if (row && row.id) {
          table.set(row.id, { ...row });
          storeInstance.saveToFile();
        }
        return { data: row, error: null };
      },
      delete() {
        const query = {
          async eq(col, val) {
            if (col === "id") {
              table.delete(val);
            } else {
              for (const [k, v] of table.entries()) {
                if (v[col] === val || v.data?.[col] === val) {
                  table.delete(k);
                }
              }
            }
            storeInstance.saveToFile();
            return { data: null, error: null };
          },
          async in(col, vals) {
            const set = new Set(vals);
            if (col === "id") {
              for (const id of set) {
                table.delete(id);
              }
            } else {
              for (const [k, v] of table.entries()) {
                if (set.has(v[col]) || set.has(v.data?.[col])) {
                  table.delete(k);
                }
              }
            }
            storeInstance.saveToFile();
            return { data: null, error: null };
          },
          async not(_col, _op, _val) {
            table.clear();
            storeInstance.saveToFile();
            return { data: null, error: null };
          },
          async neq(col, val) {
            for (const [k, v] of table.entries()) {
              if (v[col] !== val && v.data?.[col] !== val) {
                table.delete(k);
              }
            }
            storeInstance.saveToFile();
            return { data: null, error: null };
          },
          then(resolve, reject) {
            table.clear();
            storeInstance.saveToFile();
            return Promise.resolve({ data: null, error: null }).then(resolve, reject);
          },
        };
        return query;
      },
    };
  }
}

export const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        realtime: {
          transport: WebSocket,
        },
      })
    : (() => {
        console.warn(
          "[supabase] SUPABASE_URL or SUPABASE_SECRET_KEY not set. Using local file-backed persistent store.",
        );
        return new MemoryStore();
      })();
