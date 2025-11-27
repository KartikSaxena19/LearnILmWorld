import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { motion } from "framer-motion";
import { Check, ChevronsUpDown } from "lucide-react";
import FormLabel from "../../../components/FormLabel";

/* ---------------------------------------
   OPTION CONSTANTS DEFINED HERE
---------------------------------------- */

const SUBJECT_OPTIONS = [
  { value: "Maths", label: "Maths" },
  { value: "Science", label: "Science" },
  { value: "English", label: "English" },
  { value: "Physics", label: "Physics" },
  { value: "Chemistry", label: "Chemistry" },
  { value: "Biology", label: "Biology" },
];

const LANGUAGE_OPTIONS = [
  { value: "English", label: "English" },
  { value: "Hindi", label: "Hindi" },
  { value: "Urdu", label: "Urdu" },
  { value: "Tamil", label: "Tamil" },
  { value: "Telugu", label: "Telugu" },
];

const HOBBY_OPTIONS = [
  { value: "Drawing", label: "Drawing" },
  { value: "Singing", label: "Singing" },
  { value: "Dancing", label: "Dancing" },
  { value: "Cooking", label: "Cooking" },
];

const STANDARD_OPTIONS = [
  // { value: "Class 1", label: "Class 1" },
  // { value: "Class 2", label: "Class 2" },
  // { value: "Class 3", label: "Class 3" },
  // { value: "Class 4", label: "Class 4" },
  { value: "Class 5", label: "Class 5" },
  { value: "Class 6", label: "Class 6" },
  { value: "Class 7", label: "Class 7" },
  { value: "Class 8", label: "Class 8" },
  { value: "Class 9", label: "Class 9" },
  { value: "Class 10", label: "Class 10" },
  { value: "Class 11", label: "Class 11" },
  { value: "Class 12", label: "Class 12" },
];

/* ---------------------------------------
   MULTISELECT COMPONENT (SELF CONTAINED)
---------------------------------------- */

function MultiSelect({
  options,
  selected,
  setSelected,
  placeholder,
  single = false,
}: any) {
  const handleSelection = (val: any) => {
    if (single) {
      setSelected([val]);
      return;
    }

    if (selected.includes(val)) {
      setSelected(selected.filter((item: any) => item !== val));
    } else {
      setSelected([...selected, val]);
    }
  };

  return (
    <Listbox value={selected} onChange={handleSelection} multiple={!single}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg border bg-white py-2 pl-3 pr-10 text-left shadow-sm">
          <span className="block truncate">
            {selected.length === 0
              ? placeholder
              : single
              ? options.find((o: any) => o.value === selected[0])?.label
              : `${selected.length} selected`}
          </span>

          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronsUpDown size={18} className="opacity-60" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg border">
            {options.map((option: any, idx: number) => (
              <Listbox.Option
                key={idx}
                value={option.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? "bg-blue-100 text-blue-900" : "text-gray-900"
                  }`
                }
              >
                {({ selected: isSelected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        isSelected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {option.label}
                    </span>
                    {isSelected && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                        <Check size={18} />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

/* ---------------------------------------
   SELECTED CHIPS COMPONENT
---------------------------------------- */

function SelectedChips({ items, setItems }: any) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {items.map((item: string, idx: number) => (
        <span
          key={idx}
          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
        >
          {item}
          <button
            onClick={() => setItems(items.filter((x: string) => x !== item))}
            className="text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}

/* ---------------------------------------
        MAIN TRAINER TEACH STEP
---------------------------------------- */

type Props = {
  formData: any;
  setFormData: any;
  onNext: () => void;
  onBack: () => void;
  comingFromBack: boolean;
};

export default function StepTrainerTeach({
  formData,
  setFormData,
  onNext,
  onBack,
  comingFromBack,
}: Props) {
  const [teachingType, setTeachingType] = useState(formData.teachingType || "");

  const [subjects, setSubjects] = useState<string[]>(formData.teachingSubjects || []);
  const [languages, setLanguages] = useState<string[]>(formData.teachingLanguages || []);
  const [hobbies, setHobbies] = useState<string[]>(formData.teachingHobbies || []);
  const [standards, setStandards] = useState<string[]>(formData.teachingStandards || []);

  const [showCustomStandard, setShowCustomStandard] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      teachingType,
      teachingSubjects: subjects,
      teachingLanguages: languages,
      teachingHobbies: hobbies,
      teachingStandards: standards,
    }));
  }, [teachingType, subjects, languages, hobbies, standards]);

  const canProceed = () => {
    if (!teachingType) return false;

    const selectedSomething =
      subjects.length > 0 || languages.length > 0 || hobbies.length > 0;

    if (!selectedSomething) return false;

    if (subjects.length > 0 && standards.length === 0) return false;

    return true;
  };

  return (
    <motion.div
      initial={{ x: comingFromBack ? -40 : 40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: comingFromBack ? 40 : -40, opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-semibold">Your Teaching Expertize</h2>

      {/* Teaching Type */}
      <div>
        <FormLabel required>Teaching Type</FormLabel>

        {/* <label className="font-medium">Teaching Type</label> */}
        <MultiSelect
          single
          options={[
            { value: "subjects", label: "Subjects" },
            { value: "languages", label: "Languages" },
            { value: "hobbies", label: "Hobbies" },
          ]}
          selected={teachingType ? [teachingType] : []}
          setSelected={(val: any) => setTeachingType(val[0] || "")}
          placeholder="Select teaching type"
        />
      </div>

      {/* Subjects */}
      {(teachingType === "subjects" ) && (
        <div>
         <FormLabel required={teachingType === "subjects"}>Subjects (Max 3)</FormLabel>

          <MultiSelect
            options={SUBJECT_OPTIONS}
            selected={subjects}
            setSelected={(vals: string[]) => vals.length <= 3 && setSubjects(vals)}
            placeholder="Select subjects"
          />
          <SelectedChips items={subjects} setItems={setSubjects} />
        </div>
      )}

      {/* Languages */}
      {(teachingType === "languages" ) && (
        <div>
          <FormLabel required={teachingType === "languages"}>Languages (Max 2)</FormLabel>
          <MultiSelect
            options={LANGUAGE_OPTIONS}
            selected={languages}
            setSelected={(vals: string[]) => vals.length <= 2 && setLanguages(vals)}
            placeholder="Select languages"
          />
          <SelectedChips items={languages} setItems={setLanguages} />
        </div>
      )}

      {/* Hobbies */}
      {(teachingType === "hobbies") && (
        <div>
          <FormLabel required={teachingType === "hobbies"}>Hobbies (Max 2)</FormLabel>
          <MultiSelect
            options={HOBBY_OPTIONS}
            selected={hobbies}
            setSelected={(vals: string[]) => vals.length <= 2 && setHobbies(vals)}
            placeholder="Select hobbies"
          />
          <SelectedChips items={hobbies} setItems={setHobbies} />
        </div>
      )}

      {/* Standards for Subjects */}
      {subjects.length > 0 && (
        <div>
          <FormLabel required={subjects.length > 0}>Standards Required</FormLabel>
          <MultiSelect
            options={[...STANDARD_OPTIONS, { value: "custom", label: "Custom Range" }]}
            selected={standards}
            setSelected={(vals: any) => {
              if (vals.includes("custom")) {
                setShowCustomStandard(true);
                return;
              }
              setStandards(vals);
            }}
            placeholder="Select standards"
          />

          <SelectedChips items={standards} setItems={setStandards} />

          {showCustomStandard && (
            <div className="mt-3 p-3 border rounded-lg bg-gray-50 space-y-3">
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="From"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="To"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className="w-full border px-3 py-2 rounded-lg"
                />
              </div>

              <button
                onClick={() => {
                  if (!customFrom || !customTo) return;
                  setStandards([...standards, `Class ${customFrom}-${customTo}`]);
                  setShowCustomStandard(false);
                  setCustomFrom("");
                  setCustomTo("");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Add Range
              </button>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed()}
          className={`px-5 py-2 rounded-md text-white ${
            canProceed()
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}
