import React, { useState } from 'react'
import Navbar from 'components/Navbar'
import FileUploader from 'components/FileUploader';
import { usePuterStore } from 'lib/puter';
import { useNavigate } from 'react-router';
import { convertPdfToImage } from 'lib/pdf-to-image';
import { generateUUID } from 'utils';
import { prepareInstructions } from '../../constants';

interface HandleAnalyzeResumeProps {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file?: File | null;
}

const UploadResume = () => {
    const { auth, isLoading, kv, ai, fs } = usePuterStore();

    const navigate = useNavigate();

    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [file, setFile] = useState(null as File | null);

    const handleFileSelect = (file: File | null) => {
        setFile(file);
    }

    const handleAnalyzeResume = async ({ companyName, jobTitle, jobDescription, file }: HandleAnalyzeResumeProps) => {
        setIsProcessing(true);
        setStatusText("Uploading the file...");

        const uploadedFile = await fs.upload([file!]);

        if (!uploadedFile) {
            setIsProcessing(false);
            setStatusText("Failed to upload the file. Please try again.");
            return;
        }

        setStatusText("Converting the file to an Image...")

        // convert the PDF to an image
        const imageFile = await convertPdfToImage(file!);
        if (!imageFile.file) {
            setIsProcessing(false);
            setStatusText("Failed to convert the file to an image. Please try again.");
            return;
        }
        setStatusText("Uploading the image...");
        const uploadedImage = await fs.upload([imageFile.file]);
        if (!uploadedImage) {
            setIsProcessing(false);
            setStatusText("Failed to upload the image. Please try again.");
            return;
        }

        setStatusText("Preparing Data...");

        const uuid = generateUUID();

        const data = {
            id: uuid,
            companyName,
            jobTitle,
            jobDescription,
            imagePath: uploadedImage.path,
            resumePath: uploadedFile.path,
            feedback: "",
        }

        await kv.set(`resume:${uuid}`, JSON.stringify(data));

        setStatusText("Analyzing the resume...");

        const feedback = await ai.feedback(uploadedFile.path, prepareInstructions({jobTitle, jobDescription}));

        if(!feedback) {
            setIsProcessing(false);
            setStatusText("Failed to analyze the resume. Please try again.");
            return;
        }

        const feedbackText = typeof feedback.message.content === "string" ? feedback.message.content : feedback.message.content?.[0].text;

        data.feedback = feedbackText;
        await kv.set(`resume:${uuid}`, JSON.stringify(data));
        setIsProcessing(false);
        setStatusText("Analysis complete! Redirecting to the results...");

        console.log("Resume Data:", data); // for debugging
    }


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const form = event.currentTarget.closest("form");
        
        if (!form) return;

        const formData = new FormData(form);

        const companyName = formData.get("company-name") as string;
        const jobTitle = formData.get("job-title") as string;
        const jobDescription = formData.get("job-description") as string;
        
        if (!file) return;

        handleAnalyzeResume({companyName, jobTitle, jobDescription, file})
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Smart Feedback for your dream job</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img
                                src="/images/resume-scan.gif"
                                alt="resume scanner"
                                className='w-full'
                            />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and tips for improvement</h2>
                    )}
                </div>

                {!isProcessing && (
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 my-8 mx-auto px-5 md:px-10 lg:px-20 xl:px-32 2xl:px-40 container'>
                        <div className="form-div">
                            <label htmlFor="company-name">Company Name</label>
                            <input
                                type="text"
                                name='company-name'
                                id='company-name'
                            />
                        </div>
                        <div className="form-div">
                            <label htmlFor="job-title">Job Title</label>
                            <input
                                type="text"
                                name='job-title'
                                id='job-title'
                            />
                        </div>

                        <div className="form-div">
                            <label htmlFor="job-description">Job Description</label>
                            <textarea
                                rows={10}
                                name='job-description'
                                id='job-description'
                            />
                        </div>

                        <div className="form-div">
                            <label htmlFor="uploader">Job Description</label>
                            <FileUploader onFileSelect={handleFileSelect} />
                        </div>

                        <button type='submit' className='primary-button'>Analyze Resume</button>
                    </form>
                )} 
            </section>
        </main>
    )
}

export default UploadResume