import React from 'react'
import { Link } from 'react-router-dom'
import done from '../../assets/done.svg'
import block from '../../assets/block.svg'
import cancel from '../../assets/cancel.svg'

const StatusBar = ({ status, order_id, created_at }) => {
    return (
        <div className="flex flex-col gap-6 relative">
            {/* Этап 1: Заказ создан */}
            <div className="status-item border-green border-[1px] rounded-xl">
                <div className="flex gap-2 p-2">
                    <img src={block} alt="created" />
                    <div>
                        <p>Заказ создан</p>
                        <p className="text-sm">
                            {new Date(created_at).toLocaleDateString('ru-RU', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Этап 2: Заказ одобрен и ждет оплаты */}
            {(status === 'pending_payment' || status === 'completed') && (
                <div className="status-item border-green border-[1px] rounded-xl">
                    <div className="flex gap-2 p-2">
                        <img src={done} alt="pending_payment" />
                        <p>Заказ одобрен</p>
                    </div>
                </div>
            )}

            {status === 'pending_payment' && (
                <div>
                    {status === 'pending_payment' && (
                        <Link to={`/buy/${order_id}`}>
                            <p className="bg-green rounded-xl p-2">Оплатить</p>
                        </Link>
                    )}
                </div>
            )}

            {/* Этап 3: Заказ отклонен */}
            {status === 'rejected' && (
                <div className="status-item border-red border-[1px] rounded-xl">
                    <div className="flex gap-2 p-2">
                        <img src={cancel} alt="rejected" />
                        <p>Заказ отклонен</p>
                    </div>
                </div>
            )}

            {/* Этап 4: Заказ оплачен */}
            {status === 'completed' && (
                <div className="status-item border-green border-[1px] rounded-xl">
                    <div className="flex gap-2 p-2">
                        <img src={done} alt="completed" />
                        <p>Заказ оплачен</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StatusBar
