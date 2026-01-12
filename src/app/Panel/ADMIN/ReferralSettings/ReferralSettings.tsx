//@ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  Plus,
  Trash2,
  Save,
  XCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useActionCall, useGetCall } from "@/hooks";
import { SERVICE } from "@/constants/services";
import Loader from "@/components/ui/Loader";

// --- YUP VALIDATION SCHEMA ---
const RangeSchema = yup.object().shape({
  start_range: yup
    .number()
    .integer("Must be an integer")
    .min(1, "Must be 1 or greater")
    .required("Start range is required"),
  end_range: yup
    .number()
    .integer("Must be an integer")
    .min(yup.ref("start_range"), "End range must be >= Start range")
    .required("End range is required"),
  amount: yup
    .number()
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),
  msg: yup
    .string()
    .max(50, "Message must be 50 characters or less")
    .required("Message is required"),
});

const LevelSchema = yup.object().shape({
  ranges: yup
    .array()
    .of(RangeSchema)
    .min(1, "Must have at least one range")
    .required("Ranges are required")
    .test(
      "is-contiguous",
      "Ranges must be contiguous and non-overlapping. Ensure the next range starts one unit after the previous one ends (e.g., 1-10, then 11-20).",
      (ranges) => {
        if (!ranges || ranges.length < 2) return true;

        for (let i = 0; i < ranges.length - 1; i++) {
          const current = ranges[i];
          const next = ranges[i + 1];

          if (current.end_range >= next.start_range) {
            return false;
          }

          if (next.start_range !== current.end_range + 1) {
            return false;
          }
        }
        return true;
      }
    ),
});

// --- Helper Function to Prepare Initial Form Values ---
const getInitialValues = (setting, levelId) => ({
  promotor_level: setting?.promotor_level ?? levelId,
  ranges:
    setting?.ranges?.length > 0
      ? setting.ranges.map((r) => ({
          id: r.id,
          start_range: r.start_range,
          end_range: r.end_range,
          amount: parseFloat(r.amount) || 0,
          msg: r.msg || "Default Reward Message",
        }))
      : [{ start_range: 1, end_range: 5, amount: 100, msg: "Initial Reward" }],
});

export default function ReferralSettings() {
  const promotorLevels = useMemo(
    () => [
      { key: "promotor", levelId: 0, name: "Promotor" },
      { key: "promotor1", levelId: 1, name: "Promotor 1" },
      { key: "promotor2", levelId: 2, name: "Promotor 2" },
      { key: "promotor3", levelId: 3, name: "Promotor 3" },
      { key: "promotor4", levelId: 4, name: "Promotor 4" },
    ],
    []
  );

  const [activeTabKey, setActiveTabKey] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeLevelInfo = promotorLevels.find(
    (l) => l.levelId === activeTabKey
  );
  const activeLevelId = activeLevelInfo?.levelId;

  // API Hook for fetching data
  const {
    loading,
    data: scratchData,
    error: apiError,
    fetchApi: getPromoterLevel,
  } = useGetCall(SERVICE.GET_SCRATCH, {
    key: String(activeTabKey),
  });

  const { loading: actionLoading, Put: updateReward } = useActionCall(
    SERVICE.GET_SCRATCH
  );

  // Initialize formik
  const formik = useFormik({
    initialValues: {
      promotor_level: activeLevelId,
      ranges: [
        { start_range: 1, end_range: 5, amount: 100, msg: "Initial Reward" },
      ],
    },
    validationSchema: LevelSchema,
    onSubmit: async (values) => {
      await saveSettings();
    },
    enableReinitialize: false,
  });

  // Handle API response and update formik values
  useEffect(() => {
    if (scratchData?.success && scratchData?.data) {
      const apiData = scratchData.data;
      const transformedData = {
        promotor_level: apiData.promotor_level,
        ranges:
          apiData.ranges.length > 0
            ? apiData.ranges.map((r) => ({
                id: r.id,
                start_range: r.start_range,
                end_range: r.end_range,
                amount: parseFloat(r.amount) || 0,
                msg: r.msg || "",
              }))
            : [
                {
                  start_range: 1,
                  end_range: 5,
                  amount: 100,
                  msg: "Initial Reward",
                },
              ],
      };
      formik.setValues(transformedData);
      setSaveStatus(null);
    } else if (scratchData?.success === true && scratchData?.data === null) {
      // API returned null, initialize with default range
      formik.setValues({
        promotor_level: activeLevelId,
        ranges: [
          { start_range: 1, end_range: 5, amount: 100, msg: "Initial Reward" },
        ],
      });
      setSaveStatus(null);
    }
  }, [scratchData, activeLevelId]);

  // Track if there are unsaved changes
  const hasChanges = useMemo(() => {
    if (!scratchData?.data) return false;

    const apiData = scratchData.data;
    const apiRanges = apiData.ranges.map((r) => ({
      start_range: r.start_range,
      end_range: r.end_range,
      amount: parseFloat(r.amount),
      msg: r.msg,
    }));

    const formRanges = formik.values.ranges.map((r) => ({
      start_range: r.start_range,
      end_range: r.end_range,
      amount: parseFloat(r.amount),
      msg: r.msg,
    }));

    return JSON.stringify(apiRanges) !== JSON.stringify(formRanges);
  }, [formik.values, scratchData]);

  // --- Range Management Functions ---
  const handleRangeValueChange = (index, fieldName, value) => {
    formik.setFieldValue(`ranges[${index}].${fieldName}`, value);

    // Auto-adjust next range's start when current end changes
    if (fieldName === "end_range" && index < formik.values.ranges.length - 1) {
      const newStartValue = Number(value) + 1;
      if (!isNaN(newStartValue) && newStartValue > 0) {
        formik.setFieldValue(`ranges[${index + 1}].start_range`, newStartValue);
      }
    }
  };

  const addRange = () => {
    const lastRange = formik.values.ranges[formik.values.ranges.length - 1];

    formik.setFieldValue("ranges", [
      ...formik.values.ranges,
      {
        start_range: lastRange ? Number(lastRange.end_range) + 1 : 1,
        end_range: lastRange ? Number(lastRange.end_range) + 5 : 5,
        amount: 100,
        msg: "New Range Reward",
      },
    ]);
  };

  const removeRange = (rangeIndex) => {
    if (formik.values.ranges.length > 1) {
      formik.setFieldValue(
        "ranges",
        formik.values.ranges.filter((_, index) => index !== rangeIndex)
      );
    }
  };

  // --- Save/Reset Functions ---
  const saveSettings = async () => {
    setSaveStatus(null);
    setIsSubmitting(true);

    // Trigger validation and touch all fields
    const errors = await formik.validateForm();
    formik.setTouched({
      ranges: formik.values.ranges.map(() => ({
        start_range: true,
        end_range: true,
        amount: true,
        msg: true,
      })),
    });

    if (Object.keys(errors).length === 0) {
      try {
        // Prepare API Payload (POST format)
        const apiPayload = {
          promotor_level: formik.values.promotor_level,
          is_active: 1,
          ranges: formik.values.ranges.map((r) => ({
            start_range: r.start_range,
            end_range: r.end_range,
            amount: parseFloat(r.amount),
            msg: r.msg,
          })),
        };

        let response = await updateReward(
          String(formik.values.promotor_level),
          apiPayload
        );
        if (response) {
          setSaveStatus("success");

          // Refresh data from API after successful save
          setTimeout(() => {
            getPromoterLevel({ key: String(activeLevelId) });
          }, 500);
        }
      } catch (error) {
        console.error("Error saving settings:", error);
        setSaveStatus("error");
      }
    } else {
      console.error("Validation failed:", errors);
      setSaveStatus("error");
    }

    setIsSubmitting(false);
  };

  const resetSettings = () => {
    if (scratchData?.data) {
      const apiData = scratchData.data;
      formik.resetForm({
        values: {
          promotor_level: apiData.promotor_level,
          ranges: apiData.ranges.map((r) => ({
            id: r.id,
            start_range: r.start_range,
            end_range: r.end_range,
            amount: parseFloat(r.amount) || 0,
            msg: r.msg || "",
          })),
        },
      });
    } else {
      formik.resetForm({
        values: {
          promotor_level: activeLevelId,
          ranges: [
            {
              start_range: 1,
              end_range: 5,
              amount: 100,
              msg: "Initial Reward",
            },
          ],
        },
      });
    }

    setSaveStatus(null);
  };

  // Handle tab change
  const handleTabChange = (levelId) => {
    setActiveTabKey(levelId);
    getPromoterLevel({ key: String(levelId) });
    setSaveStatus(null);
  };

  // --- Render Component ---
  const RangeEditor = () => {
    const ranges = formik.values.ranges;
    const rangeArrayErrors = formik.errors.ranges;
    const hasFormErrors = formik.errors.ranges && formik.touched.ranges;

    return (
      <div className="space-y-6">
        {/* Save Status Messages */}
        {saveStatus === "success" && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Settings Saved Successfully
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  Your Promotion cashback settings have been updated.
                </p>
              </div>
            </div>
          </div>
        )}

        {saveStatus === "error" && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Save Failed
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  Please fix the validation errors before saving.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Global validation status */}
        {hasFormErrors && !saveStatus && (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Validation Issues Detected
                </h3>
                <p className="mt-1 text-sm text-yellow-700">
                  Please review and fix the errors below before saving.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Array-Level Error for Contiguity/Overlap */}
        {typeof rangeArrayErrors === "string" && (
          <div className="p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg font-medium flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span>Validation Error: {rangeArrayErrors}</span>
          </div>
        )}

        {/* Range Fields */}
        {ranges.map((range, rangeIndex) => {
          const baseName = `ranges[${rangeIndex}]`;
          const errors = formik.errors.ranges?.[rangeIndex] || {};
          const touched = formik.touched.ranges?.[rangeIndex] || {};

          return (
            <div
              key={rangeIndex}
              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 transition-shadow hover:shadow-md"
            >
              <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Start Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From (Promotion)
                  </label>
                  <input
                    type="number"
                    min="1"
                    name={`${baseName}.start_range`}
                    disabled={rangeIndex !== 0}
                    value={range.start_range}
                    onChange={(e) =>
                      handleRangeValueChange(
                        rangeIndex,
                        "start_range",
                        Number(e.target.value)
                      )
                    }
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed ${
                      errors.start_range && touched.start_range
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.start_range && touched.start_range && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.start_range}
                    </p>
                  )}
                </div>

                {/* End Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To (Promotion)
                  </label>
                  <input
                    type="number"
                    min={range.start_range}
                    name={`${baseName}.end_range`}
                    value={range.end_range}
                    onChange={(e) =>
                      handleRangeValueChange(
                        rangeIndex,
                        "end_range",
                        Number(e.target.value)
                      )
                    }
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                      errors.end_range && touched.end_range
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.end_range && touched.end_range && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.end_range}
                    </p>
                  )}
                </div>

                {/* Cashback Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cashback (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name={`${baseName}.amount`}
                    value={range.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                      errors.amount && touched.amount
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.amount && touched.amount && (
                    <p className="text-xs text-red-500 mt-1">{errors.amount}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <input
                    type="text"
                    name={`${baseName}.msg`}
                    value={range.msg}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxLength={50}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 ${
                      errors.msg && touched.msg
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                  />
                  {errors.msg && touched.msg && (
                    <p className="text-xs text-red-500 mt-1">{errors.msg}</p>
                  )}
                </div>
              </div>

              {formik.values.ranges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRange(rangeIndex)}
                  className="mt-7 text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                  title="Remove Range"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Range Button */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={addRange}
            className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Range
          </button>
        </div>

        {/* Range Preview */}
        <div className="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg shadow-inner">
          <h4 className="text-sm font-semibold text-indigo-900 mb-2">
            Earning Structure Preview
          </h4>
          <div className="text-sm text-indigo-800 space-y-1">
            {ranges.map((range, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {range.start_range} - {range.end_range} Referrals
                </span>
                <span className="font-medium">
                  ₹{range.amount} Cashback ({range.msg})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-['Inter']">
      {/* Header and Save/Reset Actions */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">
              Promotion Cashback Settings
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Configure earning ranges for each promoter level
            </p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button
              onClick={saveSettings}
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 border border-transparent rounded-lg shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02]"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabbed Interface */}
      <div className="bg-white shadow-xl rounded-xl border border-gray-100">
        {/* Tab Navigation */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-2">
            {promotorLevels.map((level) => {
              const isActiveTab = activeTabKey === level.levelId;

              return (
                <button
                  key={level.levelId}
                  onClick={() => handleTabChange(level.levelId)}
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isActiveTab
                      ? "bg-blue-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                >
                  {level.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader />
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <XCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error Loading Data
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    Failed to fetch promoter level data. Please try again.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <RangeEditor />
          )}
        </div>
      </div>
    </div>
  );
}
