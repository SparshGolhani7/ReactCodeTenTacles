import React, { useEffect, useState } from "react";
import Select from 'react-select';
import { fetchCountryList, fetchStateList } from '../../api';

export default function CountryDetails(props) {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadCountries = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchCountryList();
                if (data && data.data) {
                    setCountries(data.data.map(c => ({ value: c.id, label: c.name })));
                } else {
                    setError("Failed to load countries");
                }
            } catch (e) {
                setError("Network error");
            }
            setLoading(false);
        };
        loadCountries();
    }, []);

    useEffect(() => {
        if (!props.formData.countryId) return;
        const loadStates = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await fetchStateList(props.formData.countryId);
                if (data && data.data) {
                    setStates(data.data.map(s => ({ value: s.id, label: s.name })));
                } else {
                    setError("Failed to load states");
                }
            } catch (e) {
                setError("Network error");
            }
            setLoading(false);
        };
        loadStates();
    }, [props.formData.countryId]);

    return (
       <>
         <div className="flex   w-full p-2 ">
                <div className=" w-full">
                    <h1 className="block text-left w-full text-gray-800 text-2xl font-bold mb-6">Details</h1>
                    <form>
                    <div className=" grid gap-2 md:grid-cols-2">
                    <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium text-gray-700 text-left" htmlFor="country">
                                Select Country
                            </label>
                        <Select
                        className="basic-single text-left text-sm text-gray-700  rounded border border-gray-200"
                        classNamePrefix="select"
                        options={countries}
                        value={countries.find(c => c.value === props.formData.countryId) || null}
                        onChange={option => props.setFormData(fd => ({ ...fd, countryId: option ? option.value : null }))}
                        isLoading={loading}
                        placeholder={loading ? 'Loading...' : 'Select...'}
                        noOptionsMessage={() => error ? 'Network error' : 'No options'}
                        />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium  text-gray-700 text-left" htmlFor="state">
                                Select State
                            </label>
                            <Select
                                  className="basic-single text-left text-sm rounded text-gray-700 border border-gray-200"
                                  classNamePrefix="select"
                                  options={states}
                                  value={states.find(s => s.value === props.formData.stateId) || null}
                                  onChange={option => props.setFormData(fd => ({ ...fd, stateId: option ? option.value : null }))}
                                  isLoading={loading}
                                  placeholder={loading ? 'Loading...' : 'Select...'}
                                  noOptionsMessage={() => error ? 'Network error' : 'No options'}
                            />
                        </div>
                        {error && <div className="text-red-500 text-center mb-2">{error}</div>}
                       </div>
                    </form>
                </div>
            </div>
       </>
    )
}
