import React from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function SelectRole() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm text-center">
        {/* Lock Icon */}
        <div className="text-4xl text-green-600 mb-4">
          <i className="fas fa-lock"></i>
        </div>

        <h2 className="text-2xl font-bold mb-2">Complete you identication</h2>
        <p className="text-gray-600 mb-6">You must have to select any one</p>

        <form  className="flex flex-col gap-4">
          <RadioGroup defaultValue="jobseeker" name="role">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="employer" id="r1" />
                  <Label htmlFor="r1">Employer </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="jobseeker" id="r2" />
                  <Label htmlFor="r2">Jobseeker</Label>
                </div>
              </RadioGroup>
          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
