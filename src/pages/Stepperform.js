import React, { useState } from 'react';
import PersonalDetails from "./stepperform/personaldetails";
import CountryDetails from "./stepperform/countrydetails";
import SkillsDetails from "./stepperform/skillsdetails";
import CredentailDetails from "./stepperform/credentaildetails";
import { Stepper, Step, StepLabel, Button, Typography } from '@mui/material';
import Layout from "../component/Layout";
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../api';
const steps = ['Personal Information', 'Details', 'Skills Details', "Credentail Details"];

export default function Stepperform() {
    const [activeStep, setActiveStep] = useState(0);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleNext = async () => {
        if (activeStep === steps.length - 1) {
            // Submit registration
            setError("");
            setSuccess("");
            try {
                const submitData = new FormData();
                // Collect all fields from formData
                Object.entries(formData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        submitData.append(key, value);
                    }
                });
                const res = await registerUser(submitData);
                if (res.success) {
                    setSuccess("Registration successful!");
                    setTimeout(() => navigate("/List"), 1000);
                } else {
                    setError(res.message || "Registration failed");
                }
            } catch (e) {
                setError("Network error");
            }
        } else {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <PersonalDetails formData={formData} setFormData={setFormData} />
                );
            case 1:
                return (
                    <CountryDetails formData={formData} setFormData={setFormData} />
                );
            case 2:
                return (
                    <SkillsDetails formData={formData} setFormData={setFormData} />
                );
            case 3:
                return (
                    <CredentailDetails formData={formData} setFormData={setFormData} />
                );
            default:
                return 'Unknown step';
        }
    };

    return (
        <Layout>
            <div className="bg-white p-4 mb-2 rounded-lg  dark:border-gray-700 mt-14">
                <div>
                    <h3 className="!text-defaulttextcolor dark:!text-defaulttextcolor/70 dark:text-white text-left dark:hover:text-white text-[1.125rem] font-semibold">Stepper Form</h3>
                </div>
            </div>
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700 mb-2">
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>
            </div>
            <div className="bg-white">
                <div className="p-4 rounded-lg dark:border-gray-700">
                    <>
                        {activeStep === steps.length ? (
                            <div className="flex justify-center  w-full mt-5">
                                <div className=" p-8 m-4">
                                    <Typography variant="h5" className='mt-10 mb-10 pb-10'>Thank you for submitting the form!</Typography>
                                    <Link to="/List" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">View List
                                        </Link> 
                                </div>
                            </div>
                        ) : (
                            <>
                                <Typography variant="h5">{getStepContent(activeStep)}</Typography>
                                {error && <div className="text-red-500 text-center mb-2">{error}</div>}
                                {success && <div className="text-green-600 text-center mb-2">{success}</div>}
                                <div className='flex justify-center'>
                                    <div className='flex justify-between w-full mt-4'>
                                        <Button className="bg-back " disabled={activeStep === 0} onClick={handleBack}>
                                            Back
                                        </Button>
                                        <Button variant="contained" color="primary" onClick={handleNext}>
                                            {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
                                        </Button>
                                    </div>
                                </div>
                            </>
                        )}
                    </>
                </div>
            </div>
        </Layout>
    );
};


