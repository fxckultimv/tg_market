import React from 'react'
import { nanoTonToTon } from '../../utils/tonConversion'
import Ton from '../../assets/ton_symbol.svg'
import DefaultImage from '../../assets/defaultImage.png'
import EquivalentCourse from '../../components/EquivalentCourse'
import { useTranslation } from 'react-i18next'

const ProductCart = ({ order }) => {
    const { t } = useTranslation('History')
    const statusTranslations = {
        wait: t('productCard.status.wait'),
        waiting: t('productCard.status.waiting'),
        paid: t('productCard.status.paid'),
        completed: t('productCard.status.completed'),
        pending_payment: t('productCard.status.pending_payment'),
        rejected: t('productCard.status.rejected'),
        problem: t('productCard.status.problem'),
    }

    // Если статус не найден, подставляется "Неизвестный статус"
    const translatedStatus =
        statusTranslations[order.status] || t('productCard.status.unknown')

    return (
        <div
            to={`/buy/${order.order_id}`}
            key={order.order_id}
            className="bg-card-white flex flex-col justify-center p-4 h-full rounded-xl"
        >
            <div className="flex justify-between items-start gap-4">
                <div className="max-w-[60%] break-words">
                    {' '}
                    {/* Ограничение ширины и перенос слов */}
                    <h3 className="text-xl mb-2 break-words">{order.title}</h3>
                    <p className="mb-2">{translatedStatus}</p>
                </div>
                <div className="aspect-square">
                    <img
                        className="rounded-full max-h-[111px]"
                        src={
                            `http://localhost:5000/channel_${order.channel_tg_id}.png` ||
                            DefaultImage
                        }
                        alt={order.channel_name}
                        onError={(e) => {
                            e.currentTarget.src = DefaultImage
                        }}
                    />
                </div>

                {/* <p>⭐️{channel.rating}</p> */}
                {/* <p className="font-semibold text-main-green mb-2">
                                Подписчики: {channel.subscribers_count}
                            </p> */}
                {/* <p className="text-main-gray mb-2">
                                Дата публикации:{' '}
                                {new Date(
                                    product.post_time
                                ).toLocaleDateString()}
                            </p> */}
            </div>
            <div className="bg-gray w-full h-[1px] my-4"></div>
            <div>
                <p className="">
                    {t('productCard.from')}:{' '}
                    {new Date(order.created_at).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2">
                    <img src={Ton} alt="" className="h-[2em]" />
                    <p className="text-lg">
                        {nanoTonToTon(order.total_price)} Ton
                    </p>
                </div>
                <EquivalentCourse ton={nanoTonToTon(order.total_price)} />
            </div>

            {/* <div className="flex-shrink-0">
                <img
                    className="rounded-full w-32 h-32 object-cover border-main-green border-2"
                    src={`http://localhost:5000/channel_${order.channel_tg_id}.png`}
                    alt={order.channel_name}
                />
            </div> */}
        </div>
    )
}

export default ProductCart
