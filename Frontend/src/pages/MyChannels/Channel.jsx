import React from 'react'
import InfoBox from '../../components/InfoBox'
import DefaultImage from '../../assets/defaultImage.png'

const Chennel = ({ channel }) => {
    return (
        <div
            key={channel.channel_id}
            className="flex h-full flex-col justify-center rounded-xl bg-card-white p-8"
        >
            <div className="flex justify-between flex-wrap">
                <div className="flex flex-col">
                    <h3 className="text-xl font-extrabold mb-2">
                        {channel.channel_title}
                    </h3>
                    <div>
                        <p className="">Статистика</p>
                        <div className="bg-gray w-full h-[1px] my-2"></div>
                        <InfoBox product={channel} />
                    </div>
                </div>
                <div className="aspect-square">
                    <img
                        className="rounded-full max-h-[111px] min-h-[85px]"
                        src={
                            `http://localhost:5000/channel_${channel.channel_tg_id}.png` ||
                            DefaultImage
                        }
                        alt={channel.title}
                        onError={(e) => {
                            e.currentTarget.src = DefaultImage
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default Chennel
