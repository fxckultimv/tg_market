import React from 'react'
import { Link } from 'react-router-dom'
import done from '../../assets/done.svg'
import block from '../../assets/block.svg'
import cancel from '../../assets/cancel.svg'
import paid from '../../assets/paid.svg'
import { useUserStore } from '../../store'
import Loading from '../../Loading'
import Error from '../../Error'
import { useToast } from '../../components/ToastProvider'

const StatusBar = ({ status, order_id, created_at, post_times }) => {
    const { confirmationOrder, fetchSingleHistory, error, loading } =
        useUserStore()
    const { addToast } = useToast()
    const now = new Date()

    let allDatesInPast
    if (post_times != undefined) {
        allDatesInPast =
            Array.isArray(post_times) &&
            post_times.some((time) => new Date(time) < now)
    }

    const handlerConfirmationOrder = async () => {
        if (window.confirm('Подтвердить выполнение?')) {
            try {
                await confirmationOrder(order_id)
                fetchSingleHistory(order_id)
                addToast('Заказ подтверждён!')
            } catch (err) {
                console.error('Ошибка:', err)
            }
        }
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error error={error} />
    }
    // if (allDatesInPast) {
    //     return <div>Вы опоздали </div>
    // }

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
            {(status === 'pending_payment' ||
                status === 'completed' ||
                status === 'paid') && (
                <div className="status-item border-green border-[1px] rounded-xl">
                    <div className="flex gap-2 p-2">
                        <img src={done} alt="pending_payment" />
                        <p>Заказ одобрен</p>
                    </div>
                </div>
            )}

            {status === 'pending_payment' && !allDatesInPast && (
                <div>
                    {status === 'pending_payment' && (
                        <Link to={`/buy/${order_id}`}>
                            <p className="bg-green rounded-xl p-2 pl-5">
                                Оплатить
                            </p>
                        </Link>
                    )}
                </div>
            )}

            {allDatesInPast && status === 'pending_payment' && (
                <div>
                    <p className="bg-red rounded-xl p-2 text-center">
                        Вы опоздали с оплатой
                    </p>
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
            {(status === 'paid' || status === 'completed') && (
                <div className="status-item border-green border-[1px] rounded-xl">
                    <div className="flex gap-2 p-2">
                        <img src={paid} alt="paid" />
                        <p>Заказ оплачен</p>
                    </div>
                </div>
            )}

            {/* Подтверждение выполнения заказа */}
            {(status === 'paid' || status === 'completed') &&
                allDatesInPast && (
                    <>
                        {status === 'paid' && (
                            <div className="flex flex-col justify-between gap-3">
                                <button
                                    type="submit"
                                    className="bg-green px-4 py-2 rounded-md"
                                    onClick={handlerConfirmationOrder}
                                >
                                    Подтвердить заказ
                                </button>
                                <button
                                    type="submit"
                                    className="bg-red px-4 py-2 rounded-md"
                                    onClick={() =>
                                        alert('Обратитесь в поддержку')
                                    }
                                >
                                    Открыть спор
                                </button>
                            </div>
                        )}
                    </>
                )}

            {/* Этап 5: Заказ выполнен*/}
            {status === 'completed' && (
                <div className="status-item border-green border-[1px] rounded-xl">
                    <div className="flex gap-2 p-2">
                        <img src={done} alt="completed" />
                        <p>Заказ выполнен</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default StatusBar
