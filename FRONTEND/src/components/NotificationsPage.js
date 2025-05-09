import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Notifications.css";
import ClinicalSidebar from "../components/ClinicalSidebar";

//const API_BASE_URL = "http://localhost:3001";
const API_BASE_URL = "https://medical-clinic-web-app-backend.vercel.app";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [notificationsPerPage] = useState(10);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      // In a real implementation, this would be an actual API call
      // const response = await axios.get(`${API_BASE_URL}/api/notifications`);
      // setNotifications(response.data);
      
      // Mock data for demonstration
      setTimeout(() => {
        const mockNotifications = [
          { id: 1, message: "Lab results ready for patient #1242", time: "Today, 10:25 AM", type: "lab", isRead: false, priority: "medium" },
          { id: 2, message: "Medication review required for Sarah Wilson", time: "Today, 09:50 AM", type: "medication", isRead: false, priority: "high" },
          { id: 3, message: "New referral received from Dr. Thompson", time: "Today, 09:15 AM", type: "referral", isRead: false, priority: "medium" },
          { id: 4, message: "Appointment canceled by Michael Brown", time: "Yesterday, 04:30 PM", type: "appointment", isRead: true, priority: "low" },
          { id: 5, message: "Critical lab results for patient #2341", time: "Yesterday, 02:45 PM", type: "lab", isRead: true, priority: "high" },
          { id: 6, message: "Insurance verification completed for Emma Johnson", time: "Yesterday, 01:20 PM", type: "insurance", isRead: true, priority: "medium" },
          { id: 7, message: "Medical record request from Dr. Martinez", time: "Mar 18, 2025", type: "record", isRead: true, priority: "medium" },
          { id: 8, message: "System maintenance scheduled for tonight at 2 AM", time: "Mar 18, 2025", type: "system", isRead: true, priority: "low" },
          { id: 9, message: "New patient registration: John Davis", time: "Mar 17, 2025", type: "registration", isRead: true, priority: "medium" },
          { id: 10, message: "Staff meeting reminder - Tomorrow at 8:30 AM", time: "Mar 17, 2025", type: "reminder", isRead: true, priority: "medium" },
          { id: 11, message: "Inventory alert: Low stock of surgical masks", time: "Mar 16, 2025", type: "inventory", isRead: true, priority: "high" },
          { id: 12, message: "Billing issue: Patient #3421 payment declined", time: "Mar 16, 2025", type: "billing", isRead: true, priority: "high" },
          { id: 13, message: "New protocol for COVID-19 screening published", time: "Mar 15, 2025", type: "protocol", isRead: true, priority: "medium" },
          { id: 14, message: "Dr. Johnson schedule change for next week", time: "Mar 15, 2025", type: "schedule", isRead: true, priority: "low" },
          { id: 15, message: "Annual compliance training due in 15 days", time: "Mar 14, 2025", type: "compliance", isRead: true, priority: "medium" },
        ];
        setNotifications(mockNotifications);
        setLoading(false);
      }, 800); // Simulate loading delay
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      // In a real implementation, this would be an actual API call to update read status
      // await axios.put(`${API_BASE_URL}/api/notifications/${id}/read`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // In a real implementation, this would be an actual API call to update all read statuses
      // await axios.put(`${API_BASE_URL}/api/notifications/mark-all-read`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({ ...notification, isRead: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      // In a real implementation, this would be an actual API call to delete the notification
      // await axios.delete(`${API_BASE_URL}/api/notifications/${id}`);
      
      // Update local state
      setNotifications(prevNotifications => 
        prevNotifications.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lab': return '🧪';
      case 'medication': return '💊';
      case 'referral': return '📋';
      case 'appointment': return '📅';
      case 'insurance': return '📄';
      case 'record': return '📁';
      case 'system': return '🖥️';
      case 'registration': return '📝';
      case 'reminder': return '⏰';
      case 'inventory': return '📦';
      case 'billing': return '💵';
      case 'protocol': return '📑';
      case 'schedule': return '🗓️';
      case 'compliance': return '✅';
      default: return '🔔';
    }
  };

  // Get priority class
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  // Filter notifications based on current filter
  const getFilteredNotifications = () => {
    let filtered = [...notifications];
    
    // Apply type filter
    if (filter !== 'all') {
      filtered = filtered.filter(notification => notification.type === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(notification => 
        notification.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return filtered;
  };

  const filteredNotifications = getFilteredNotifications();
  
  // Get current notifications for pagination
  const indexOfLastNotification = currentPage * notificationsPerPage;
  const indexOfFirstNotification = indexOfLastNotification - notificationsPerPage;
  const currentNotifications = filteredNotifications.slice(indexOfFirstNotification, indexOfLastNotification);

  // Calculate total pages
  const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.isRead).length;

  // Get unique notification types for filter dropdown
  const notificationTypes = ['all', ...new Set(notifications.map(notification => notification.type))];

  return (
    <div className="notifications-page">
      <ClinicalSidebar />
      <div className="notifications-content">
        <div className="notifications-header">
          <div className="notifications-title">
            <h2>Notifications</h2>
            <span className="unread-badge">{unreadCount} unread</span>
          </div>
          <div className="notifications-actions">
            <button className="action-button refresh-button" onClick={fetchNotifications}>
              <span className="button-icon">🔄</span> Refresh
            </button>
            <button className="action-button mark-read-button" onClick={markAllAsRead}>
              <span className="button-icon">✓</span> Mark All Read
            </button>
          </div>
        </div>

        <div className="notifications-filters">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="filter-container">
            <label htmlFor="notification-filter">Filter by type:</label>
            <select
              id="notification-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              {notificationTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading notifications...</p>
          </div>
        ) : (
          <>
            <div className="notifications-list">
              {currentNotifications.length === 0 ? (
                <div className="empty-notifications">
                  <div className="empty-icon">📭</div>
                  <p>No notifications found</p>
                </div>
              ) : (
                currentNotifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`notification-item ${!notification.isRead ? 'unread' : ''} ${getPriorityClass(notification.priority)}`}
                  >
                    <div className="notification-icon">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <p className="notification-message">{notification.message}</p>
                      <div className="notification-meta">
                        <span className="notification-type">{notification.type}</span>
                        <span className="notification-time">{notification.time}</span>
                      </div>
                    </div>
                    <div className="notification-actions">
                      {!notification.isRead && (
                        <button 
                          className="notification-button read-button"
                          onClick={() => markAsRead(notification.id)}
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button 
                        className="notification-button delete-button"
                        onClick={() => deleteNotification(notification.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  &laquo; Prev
                </button>
                <div className="pagination-info">
                  Page {currentPage} of {totalPages}
                </div>
                <button 
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  Next &raquo;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Notifications;
