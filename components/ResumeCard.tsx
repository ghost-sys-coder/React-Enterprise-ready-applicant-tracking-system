import React from 'react'
import { Link } from 'react-router'
import ScoreCard from './ScoreCard'

const ResumeCard = ({ key, resume: { companyName, id, jobTitle, feedback, imagePath } }: { key: string, resume: Resume }) => {
    return (
        <Link to={`/resume/${id}`} className='resume-card animate-in fade-in duration-1000'>
            <div className="resume-card-header">
                <div className="flex flex-col gap-2 ">
                    <h2 className='!text-black font-bold break-words'>{companyName}</h2>
                    <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
                </div>

                <div className="flex-shrink-0">
                    <ScoreCard score={feedback.overallScore} />
                </div>
            </div>

            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full ">
                    <img
                        src={imagePath}
                        alt='resume'
                        className='w-full h-[350px] max-sm:h-[200px] object-cover'
                    />
                </div>
            </div>
        </Link>
    )
}

export default ResumeCard