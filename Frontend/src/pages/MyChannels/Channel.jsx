import React from 'react'
import InfoBox from '../../components/InfoBox'

const Chennel = ({ channel }) => {
    return (
        <div
            key={channel.channel_id}
            className="flex h-full flex-col justify-center rounded-xl bg-card-white p-8"
        >
            <div className="flex justify-between flex-wrap">
                <div>
                    <h3 className="text-xl font-extrabold mb-2">
                        {channel.channel_name}
                    </h3>
                </div>
                <div className="aspect-square">
                    <img
                        className="rounded-full max-h-[111px] min-h-[85px]"
                        src={`http://localhost:5000/channel_${channel.channel_tg_id}.png`}
                        alt={channel.title}
                    />
                </div>
            </div>

            <div className="bg-gray w-full h-[1px] my-8"></div>
            <div>
                <p className="">Статистика</p>
                <InfoBox product={channel} />
            </div>
        </div>
    )
}

export default Chennel
