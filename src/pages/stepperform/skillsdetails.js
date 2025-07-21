import React from "react";
export default function SkillsDetails(props) {
  return (
    <>
      <div className="flex   w-full p-2 ">
        <div className=" w-full">
          <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">Skills Details</h1>
          <form>
            <div className="mb-4">
              <label className="block mb-2 text-sm font-medium text-gray-700 text-left" htmlFor="skills">
                Skills (comma separated)
              </label>
              <input
                type="text"
                placeholder="Add Skills"
                className="w-full px-3 py-3 text-sm leading-tight text-gray-700 border border-gray-200 rounded appearance-none focus:outline-none focus:shadow-outline"
                value={props.formData.skills || ''}
                onChange={e => props.setFormData(fd => ({ ...fd, skills: e.target.value }))}
                id="skills"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
