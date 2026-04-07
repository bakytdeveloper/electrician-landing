// client/src/components/Admin/Orders/OrdersTable.jsx
import React, { useState, useEffect } from 'react';
import { FaEye, FaTrash, FaFilter, FaSearch } from 'react-icons/fa';
import './OrdersTable.css';

const OrdersTable = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        search: ''
    });
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        pages: 0
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const token = localStorage.getItem('adminToken');

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                page: pagination.page,
                limit: pagination.limit,
                ...(filters.status !== 'all' && { status: filters.status }),
                ...(filters.search && { search: filters.search })
            });

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders?${queryParams}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Ошибка загрузки заказов');

            const data = await response.json();
            setOrders(data.data);
            setPagination(prev => ({
                ...prev,
                total: data.pagination.total,
                pages: data.pagination.pages
            }));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pagination.page, filters]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Ошибка обновления статуса');

            fetchOrders();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${selectedOrder._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Ошибка удаления заказа');

            setShowDeleteModal(false);
            setSelectedOrder(null);
            fetchOrders();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        }
    };

    const getStatusBadgeClass = (status) => {
        const classes = {
            'new': 'status-new',
            'contacted': 'status-contacted',
            'completed': 'status-completed',
            'cancelled': 'status-cancelled'
        };
        return classes[status] || 'status-new';
    };

    // const getStatusText = (status) => {
    //     const texts = {
    //         'new': '🆕 Новый',
    //         'contacted': '📞 Связались',
    //         'completed': '✅ Выполнен',
    //         'cancelled': '❌ Отменен'
    //     };
    //     return texts[status] || status;
    // };

    if (loading) return <div className="loading-spinner">Загрузка заказов...</div>;
    if (error) return <div className="error-message">Ошибка: {error}</div>;

    return (
        <div className="orders-table-container">
            <div className="orders-header">
                <h2>📋 Управление заказами</h2>
                <div className="orders-filters">
                    <div className="search-box">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Поиск по имени, телефону или email..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
                        />
                    </div>
                    <div className="filter-box">
                        <FaFilter />
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                        >
                            <option value="all">Все статусы</option>
                            <option value="new">🆕 Новые</option>
                            <option value="contacted">📞 Связались</option>
                            <option value="completed">✅ Выполненные</option>
                            <option value="cancelled">❌ Отмененные</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="table-responsive">
                <table className="orders-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Клиент</th>
                        <th>Телефон</th>
                        <th>Услуга</th>
                        <th>Статус</th>
                        <th>Дата</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order._id}>
                            <td>#{order._id.slice(-6)}</td>
                            <td>
                                <strong>{order.name}</strong>
                                {/*{order.email && <small>{order.email}</small>}*/}
                            </td>
                            <td>{order.phone}</td>
                            <td>{order.serviceType}</td>
                            <td>
                                <select
                                    className={`status-select ${getStatusBadgeClass(order.status)}`}
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                >
                                    <option value="new">🆕 Новый</option>
                                    <option value="contacted">📞 Связались</option>
                                    <option value="completed">✅ Выполнен</option>
                                    <option value="cancelled">❌ Отменен</option>
                                </select>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</td>
                            <td className="actions">
                                <button
                                    className="btn-view"
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowDetailsModal(true);
                                    }}
                                    title="Просмотреть"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    className="btn-delete"
                                    onClick={() => {
                                        setSelectedOrder(order);
                                        setShowDeleteModal(true);
                                    }}
                                    title="Удалить"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {pagination.pages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                        disabled={pagination.page === 1}
                    >
                        ← Назад
                    </button>
                    <span>Страница {pagination.page} из {pagination.pages}</span>
                    <button
                        onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                        disabled={pagination.page === pagination.pages}
                    >
                        Вперед →
                    </button>
                </div>
            )}

            {/* Модальное окно с деталями заказа */}
            {showDetailsModal && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setShowDetailsModal(false)}
                    onUpdate={fetchOrders}
                    token={token}
                />
            )}

            {/* Модальное окно подтверждения удаления */}
            {showDeleteModal && selectedOrder && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-delete">
                        <h3>Подтверждение удаления</h3>
                        <p>Вы уверены, что хотите удалить заказ от <strong>{selectedOrder.name}</strong>?</p>
                        <p className="warning">Это действие невозможно отменить!</p>
                        <div className="modal-actions">
                            <button onClick={() => setShowDeleteModal(false)}>Отмена</button>
                            <button onClick={handleDeleteOrder} className="btn-danger">Удалить</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Компонент модального окна с деталями заказа
const OrderDetailsModal = ({ order, onClose, onUpdate, token }) => {
    const [notes, setNotes] = useState(order.notes || '');
    const [saving, setSaving] = useState(false);

    const handleSaveNotes = async () => {
        setSaving(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/orders/${order._id}/notes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ notes })
            });

            if (!response.ok) throw new Error('Ошибка сохранения заметок');

            alert('Заметки сохранены!');
            onUpdate();
        } catch (err) {
            alert('Ошибка: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content order-details" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Детали заказа #{order._id.slice(-6)}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="order-info-grid">
                    <div className="info-group">
                        <label>👤 Клиент:</label>
                        <p><strong>{order.name}</strong></p>
                    </div>
                    <div className="info-group">
                        <label>📞 Телефон:</label>
                        <p><a href={`tel:${order.phone}`}>{order.phone}</a></p>
                    </div>
                    {order.email && (
                        <div className="info-group">
                            <label>✉️ Email:</label>
                            <p><a href={`mailto:${order.email}`}>{order.email}</a></p>
                        </div>
                    )}
                    <div className="info-group">
                        <label>🔧 Услуга:</label>
                        <p>{order.serviceType}</p>
                    </div>
                    <div className="info-group">
                        <label>📅 Дата создания:</label>
                        <p>{new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                    </div>
                    <div className="info-group">
                        <label>📊 Статус:</label>
                        <p className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                            {getStatusText(order.status)}
                        </p>
                    </div>
                </div>

                {order.message && (
                    <div className="info-group full-width">
                        <label>💬 Сообщение клиента:</label>
                        <div className="message-box">{order.message}</div>
                    </div>
                )}

                <div className="info-group full-width">
                    <label>📝 Заметки админа:</label>
                    <textarea
                        className="notes-textarea"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows="4"
                        placeholder="Добавьте заметки по заказу..."
                    />
                    <button
                        className="btn-save-notes"
                        onClick={handleSaveNotes}
                        disabled={saving}
                    >
                        {saving ? 'Сохранение...' : '💾 Сохранить заметки'}
                    </button>
                </div>

                <div className="modal-footer">
                    <button onClick={onClose}>Закрыть</button>
                </div>
            </div>
        </div>
    );
};

const getStatusBadgeClass = (status) => {
    const classes = {
        'new': 'status-new',
        'contacted': 'status-contacted',
        'completed': 'status-completed',
        'cancelled': 'status-cancelled'
    };
    return classes[status] || 'status-new';
};

const getStatusText = (status) => {
    const texts = {
        'new': '🆕 Новый',
        'contacted': '📞 Связались',
        'completed': '✅ Выполнен',
        'cancelled': '❌ Отменен'
    };
    return texts[status] || status;
};

export default OrdersTable;