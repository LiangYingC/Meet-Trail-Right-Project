import React, { Component } from 'react';
import QuestionButton from '../../../shared/QuestionButton';
import './BasicInfo.scss';


const BasicInfo = ({ basicInfoData }) => {
    return (
        <section id="trail-detail__basic-info">
            <div className="wrap">
                <h2>步道資訊</h2>
                <div className="basic-info-description">
                    {basicInfoData.description}
                </div>

                <div className="flex basic-info-list">
                    <div className="top-left">
                        <div className="flex basic-info-item">
                            <p className="subtitle">開放狀態 :</p>
                            <p>{basicInfoData.status}</p>
                        </div>
                        <div className="flex basic-info-item">
                            <p className="subtitle">所在位置 :</p>
                            <p>{`${basicInfoData.location.city}${basicInfoData.location.dist}`}</p>
                        </div>
                        <div className="flex basic-info-item">
                            <p className="subtitle">海拔高度 :</p>
                            <p>{basicInfoData.height} 公尺</p>
                        </div>
                    </div>
                    <div className="down-right">
                        <div className="flex basic-info-item">
                            <p className="subtitle">所需時間 :</p>
                            <p>單趟 {basicInfoData.time} </p>
                        </div>

                        <div className="flex basic-info-item">
                            <p className="subtitle">步道全長 :</p>
                            <p>單趟 {basicInfoData.length} 公里</p>
                        </div>
                        <div className="flex basic-info-item">
                            <p className="subtitle">步道難度 :</p>
                            <p>{basicInfoData.difficulty}
                                <QuestionButton />
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default BasicInfo