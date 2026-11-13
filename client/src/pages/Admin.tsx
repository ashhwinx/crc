import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Calculator,
  Calendar,
  Edit3,
  Image as ImageIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  Trash2,
  LogOut,
  ExternalLink,
  Save,
  Download,
  Plus,
  RefreshCw,
  Building2,
  X,
  Menu,
  Phone,
  Mail,
  HelpCircle,
  Copy,
  Check,
  Layers,
  Train,
  Home as HomeIcon,
  Info,
  Award,
} from 'lucide-react';
import {
  adminLoginApi,
  getStoredAdminToken,
  getStoredAdminUser,
  clearAdminSession,
  fetchDashboardStats,
  fetchAdminInquiries,
  updateInquiryStatusApi,
  deleteInquiryApi,
  fetchAdminEstimates,
  fetchAdminBookings,
  updateBookingStatusApi,
  fetchCmsContentApi,
  updateCmsContentApi,
  addMediaAssetApi,
  deleteMediaAssetApi,
  type DashboardStats,
  type InquiryItem,
  type EstimateItem,
  type BookingItem,
  type CmsContentData,
  type AdminUser,
} from '../services/adminApi';
import { useCms } from '../context/CmsContext';
import { ImageDropzone } from '../components/ImageDropzone';

export const Admin: React.FC = () => {
  const { refreshCms } = useCms();

  // Authentication state
  const [token, setToken] = useState<string | null>(getStoredAdminToken());
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(getStoredAdminUser());
  const [loginEmail, setLoginEmail] = useState<string>('admin@coastroadcapital.com');
  const [loginPassword, setLoginPassword] = useState<string>('crc2026!admin');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // Active navigation tab
  type AdminTab = 'inquiries' | 'bookings' | 'estimates' | 'cms' | 'media' | 'overview';
  const [activeTab, setActiveTab] = useState<AdminTab>('inquiries');

  // CMS Sub-tab
  type CmsSubTab = 'home' | 'equipment' | 'estimator' | 'partnerships' | 'about' | 'values' | 'contact' | 'faqs';
  const [cmsSubTab, setCmsSubTab] = useState<CmsSubTab>('home');

  // Mobile drawer toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Data states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [estimates, setEstimates] = useState<EstimateItem[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [cmsData, setCmsData] = useState<CmsContentData | null>(null);
  const [loadingData, setLoadingData] = useState<boolean>(false);

  // Inquiry view & filters
  const [inquirySearch, setInquirySearch] = useState<string>('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryItem | null>(null);
  const [internalNoteDraft, setInternalNoteDraft] = useState<string>('');

  // CMS Editor form states
  const [cmsSaveSuccess, setCmsSaveSuccess] = useState<boolean>(false);
  const [cmsSaving, setCmsSaving] = useState<boolean>(false);

  // Media Library add form
  const [newMediaTitle, setNewMediaTitle] = useState<string>('');
  const [newMediaUrl, setNewMediaUrl] = useState<string>('');
  const [newMediaCat, setNewMediaCat] = useState<string>('equipment');
  const [mediaAddSuccess, setMediaAddSuccess] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // FAQ Add modal state
  const [newFaqQ, setNewFaqQ] = useState<string>('');
  const [newFaqA, setNewFaqA] = useState<string>('');
  const [showAddFaq, setShowAddFaq] = useState<boolean>(false);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    const res = await adminLoginApi(loginEmail, loginPassword);
    setIsLoggingIn(false);

    if (res.success && res.user) {
      setToken(getStoredAdminToken());
      setCurrentUser(res.user);
    } else {
      setLoginError(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setToken(null);
    setCurrentUser(null);
  };

  // Load active tab data
  const loadTabData = useCallback(async () => {
    if (!token) return;
    setLoadingData(true);

    try {
      if (activeTab === 'overview') {
        const data = await fetchDashboardStats();
        if (data) setStats(data);
      } else if (activeTab === 'inquiries') {
        const list = await fetchAdminInquiries(inquiryStatusFilter, inquirySearch);
        setInquiries(list);
      } else if (activeTab === 'estimates') {
        const list = await fetchAdminEstimates();
        setEstimates(list);
      } else if (activeTab === 'bookings') {
        const list = await fetchAdminBookings();
        setBookings(list);
      } else if (activeTab === 'cms' || activeTab === 'media') {
        const content = await fetchCmsContentApi();
        if (content) setCmsData(content);
      }
    } catch (e) {
      console.error('[Admin Tab Load Error]', e);
    } finally {
      setLoadingData(false);
    }
  }, [token, activeTab, inquiryStatusFilter, inquirySearch]);

  useEffect(() => {
    if (token) {
      loadTabData();
    }
  }, [token, loadTabData]);

  // Update inquiry status
  const handleStatusChange = async (id: string, newStatus: string) => {
    const ok = await updateInquiryStatusApi(id, newStatus, internalNoteDraft);
    if (ok) {
      setInquiries((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status: newStatus as any, internalNote: internalNoteDraft } : item))
      );
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any, internalNote: internalNoteDraft } : null));
      }
    }
  };

  // Delete inquiry
  const handleDeleteInquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this quote inquiry?')) return;
    const ok = await deleteInquiryApi(id);
    if (ok) {
      setInquiries((prev) => prev.filter((i) => i._id !== id));
      if (selectedInquiry && selectedInquiry._id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  // Update booking status
  const handleBookingStatus = async (id: string, newStatus: string) => {
    const ok = await updateBookingStatusApi(id, newStatus);
    if (ok) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus as any } : b))
      );
    }
  };

  // Save CMS Content
  const handleSaveCms = async () => {
    if (!cmsData) return;
    setCmsSaving(true);
    setCmsSaveSuccess(false);

    const ok = await updateCmsContentApi(cmsData);
    setCmsSaving(false);

    if (ok) {
      setCmsSaveSuccess(true);
      await refreshCms();
      setTimeout(() => setCmsSaveSuccess(false), 3500);
    } else {
      alert('Failed to save CMS content. Please check server logs.');
    }
  };

  // Add Media Asset
  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle || !newMediaUrl) return;

    const ok = await addMediaAssetApi(newMediaTitle, newMediaUrl, newMediaCat);
    if (ok) {
      setMediaAddSuccess(true);
      setNewMediaTitle('');
      setNewMediaUrl('');
      setTimeout(() => setMediaAddSuccess(false), 3000);
      const updated = await fetchCmsContentApi();
      if (updated) setCmsData(updated);
    }
  };

  // Delete Media Asset
  const handleDeleteMedia = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this media asset? If it was uploaded, its file will be removed from disk.')) return;
    const ok = await deleteMediaAssetApi(id);
    if (ok) {
      setCmsData((prev) =>
        prev
          ? {
              ...prev,
              media: (prev.media || []).filter((m) => m.id !== id),
            }
          : null
      );
    }
  };

  // Add FAQ Item
  const handleAddFaq = () => {
    if (!newFaqQ || !newFaqA || !cmsData) return;
    const newItem = {
      id: `faq-${Date.now()}`,
      q: newFaqQ,
      a: newFaqA,
      category: 'general',
    };
    setCmsData({
      ...cmsData,
      faqs: [...(cmsData.faqs || []), newItem],
    });
    setNewFaqQ('');
    setNewFaqA('');
    setShowAddFaq(false);
  };

  const handleDeleteFaq = (id: string) => {
    if (!cmsData) return;
    setCmsData({
      ...cmsData,
      faqs: cmsData.faqs.filter((f) => f.id !== id),
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // =========================================================================
  // VIEW: LOGIN SCREEN (if not authenticated)
  // =========================================================================
  if (!token) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-box">
          <div className="admin-login-header">
            <div className="admin-brand-badge">CRC</div>
            <h2>Coast Road Capital</h2>
            <p>Admin Portal &bull; Commercial Operations &amp; CMS</p>
          </div>

          {loginError && (
            <div className="admin-login-error">
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-form-group">
              <label>Administrator Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@coastroadcapital.com"
              />
            </div>

            <div className="admin-form-group">
              <label>Secure Passkey / Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
              />
            </div>

            <button type="submit" disabled={isLoggingIn} className="admin-btn-login">
              {isLoggingIn ? 'Signing In...' : 'Sign In to Portal'}
            </button>

            <div className="admin-demo-shortcut">
              <div className="demo-badge">Default Admin Credentials</div>
              <div className="demo-creds">
                <span>Email: <code>admin@coastroadcapital.com</code></span>
                <span>Pass: <code>crc2026!admin</code></span>
              </div>
              <button
                type="button"
                className="btn-fill-demo"
                onClick={() => {
                  setLoginEmail('admin@coastroadcapital.com');
                  setLoginPassword('crc2026!admin');
                }}
              >
                Auto-fill credentials
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: MAIN ADMIN DASHBOARD (Modern Sidebar + Workspace)
  // =========================================================================
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const pendingBookingsCount = bookings.filter((b) => b.status === 'pending').length;

  return (
    <div className="admin-layout">
      {/* =====================================================================
          LEFT SIDEBAR NAVIGATION
          ===================================================================== */}
      <aside className={`admin-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">
            <div className="admin-brand-badge">CRC</div>
            <div>
              <div className="sidebar-brand-name">Coast Road Capital</div>
              <div className="sidebar-brand-sub">Management Portal</div>
            </div>
          </div>
          <button
            type="button"
            className="mobile-close-btn"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="admin-nav-list">
          {/* Group 1: Core Operations */}
          <div className="nav-group-label">Commercial Operations</div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('inquiries');
              setMobileMenuOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'inquiries' ? 'active' : ''}`}
          >
            <FileText size={17} />
            <span className="nav-label">Quote Inquiries</span>
            {newInquiriesCount > 0 && (
              <span className="nav-badge-pill">{newInquiriesCount} new</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('bookings');
              setMobileMenuOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
          >
            <Calendar size={17} />
            <span className="nav-label">Consultations</span>
            {pendingBookingsCount > 0 && (
              <span className="nav-badge-pill warning">{pendingBookingsCount}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('estimates');
              setMobileMenuOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'estimates' ? 'active' : ''}`}
          >
            <Calculator size={17} />
            <span className="nav-label">Estimator Logs</span>
          </button>

          {/* Group 2: Website CMS Studio */}
          <div className="nav-group-label">Website Content (CMS)</div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('cms');
              setMobileMenuOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'cms' ? 'active' : ''}`}
          >
            <Edit3 size={17} />
            <span className="nav-label">Edit Website Copy</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('media');
              setMobileMenuOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'media' ? 'active' : ''}`}
          >
            <ImageIcon size={17} />
            <span className="nav-label">Media Library</span>
          </button>

          {/* Group 3: Performance & Analytics */}
          <div className="nav-group-label">Analytics &amp; System</div>

          <button
            type="button"
            onClick={() => {
              setActiveTab('overview');
              setMobileMenuOpen(false);
            }}
            className={`admin-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          >
            <LayoutDashboard size={17} />
            <span className="nav-label">Performance Overview</span>
          </button>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="user-avatar">
              {currentUser?.name ? currentUser.name[0] : 'S'}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser?.name || 'Samuel Lowe'}</span>
              <span className="user-role">{currentUser?.title || 'Founder & Principal'}</span>
            </div>
          </div>

          <div className="sidebar-action-row">
            <Link to="/" target="_blank" className="btn-sidebar-link">
              <ExternalLink size={13} />
              <span>Live Website</span>
            </Link>

            <button type="button" onClick={handleLogout} className="btn-sidebar-logout">
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* =====================================================================
          MAIN WORKSPACE
          ===================================================================== */}
      <div className="admin-workspace">
        {/* Top Navbar */}
        <header className="workspace-header">
          <div className="header-left">
            <button
              type="button"
              className="mobile-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open Navigation Menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="header-title">
                {activeTab === 'inquiries' && 'Quote Inquiries & RFPs'}
                {activeTab === 'bookings' && 'Shipper Consultation Bookings'}
                {activeTab === 'estimates' && 'Cost Estimator Usage Logs'}
                {activeTab === 'cms' && 'Website Content Management (CMS)'}
                {activeTab === 'media' && 'Media & Image Asset Library'}
                {activeTab === 'overview' && 'Commercial Analytics & Overview'}
              </h1>
              <span className="header-sub">
                {activeTab === 'inquiries' && 'Manage quote requests submitted by prospective rail shippers.'}
                {activeTab === 'bookings' && 'Consultations booked for siding reviews and equipment planning.'}
                {activeTab === 'estimates' && 'Calculations run on the public freight cost estimator.'}
                {activeTab === 'cms' && 'Easily update contact information, announcements, FAQs, and equipment specs.'}
                {activeTab === 'media' && 'Browse, add, and copy asset URLs for railcars and facilities.'}
                {activeTab === 'overview' && 'Live operational metrics, demand distribution, and recent activity.'}
              </span>
            </div>
          </div>

          <div className="header-right">
            {activeTab === 'cms' && (
              <button
                type="button"
                onClick={handleSaveCms}
                disabled={cmsSaving}
                className="btn-save-cms"
              >
                <Save size={15} />
                <span>{cmsSaving ? 'Publishing...' : 'Publish to Live Site'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={loadTabData}
              className="btn-refresh"
              title="Refresh Data"
            >
              <RefreshCw size={14} className={loadingData ? 'spin' : ''} />
              <span className="desktop-only">Refresh</span>
            </button>

            <Link to="/" target="_blank" className="btn-visit-site">
              <ExternalLink size={14} />
              <span className="desktop-only">View Live Site</span>
            </Link>
          </div>
        </header>

        {/* Global Save Success Notification */}
        {cmsSaveSuccess && (
          <div className="admin-alert-banner success">
            <CheckCircle2 size={16} />
            <span>Changes successfully published to the live website!</span>
          </div>
        )}

        {/* Workspace Body */}
        <main className="workspace-main">
          {/* =================================================================
              TAB 1: INQUIRIES & QUOTE REQUESTS
              ================================================================= */}
          {activeTab === 'inquiries' && (
            <div className="tab-container">
              {/* Filter & Search Bar */}
              <div className="inquiry-filter-card">
                <div className="search-input-wrap">
                  <Search size={15} />
                  <input
                    type="text"
                    placeholder="Search by company, contact, or car type..."
                    value={inquirySearch}
                    onChange={(e) => setInquirySearch(e.target.value)}
                  />
                  {inquirySearch && (
                    <button type="button" onClick={() => setInquirySearch('')} className="clear-search">
                      <X size={13} />
                    </button>
                  )}
                </div>

                <div className="filter-pill-row">
                  {[
                    { id: 'all', label: 'All Inquiries' },
                    { id: 'new', label: 'New' },
                    { id: 'reviewing', label: 'Reviewing' },
                    { id: 'contacted', label: 'Contacted' },
                    { id: 'closed', label: 'Closed' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setInquiryStatusFilter(st.id)}
                      className={`filter-pill ${inquiryStatusFilter === st.id ? 'active' : ''}`}
                    >
                      {st.label}
                    </button>
                  ))}

                  <a
                    href="/api/admin/inquiries/export"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-export-csv"
                    title="Export in CSV format"
                  >
                    <Download size={13} />
                    <span>Export CSV</span>
                  </a>
                </div>
              </div>

              {/* Inquiries Table Card */}
              <div className="admin-card-table">
                {inquiries.length === 0 ? (
                  <div className="empty-state">
                    <FileText size={36} />
                    <h4>No quote requests found</h4>
                    <p>There are currently no customer inquiries matching your filter.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Company / Contact</th>
                          <th>Equipment &amp; Config</th>
                          <th>Quantity</th>
                          <th>Timing</th>
                          <th>Status</th>
                          <th>Received</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inquiries.map((inq) => (
                          <tr
                            key={inq._id}
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setInternalNoteDraft(inq.internalNote || '');
                            }}
                            className="clickable-row"
                          >
                            <td>
                              <div className="table-company">{inq.company}</div>
                              <div className="table-sub">{inq.name} &bull; {inq.email}</div>
                            </td>
                            <td>
                              <div className="table-bold">{inq.category}</div>
                              <div className="table-sub">{inq.configuration || 'Standard'}</div>
                            </td>
                            <td>
                              <span className="car-count-badge">{inq.quantity || '1+'} cars</span>
                            </td>
                            <td className="table-timing">{inq.timing || 'Immediate'}</td>
                            <td>
                              <span className={`status-badge ${inq.status || 'new'}`}>
                                {inq.status || 'new'}
                              </span>
                            </td>
                            <td className="table-date">
                              {new Date(inq.createdAt).toLocaleDateString()}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedInquiry(inq);
                                  setInternalNoteDraft(inq.internalNote || '');
                                }}
                                className="btn-view-row"
                              >
                                View Specs
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Inquiry Detail Drawer / Modal */}
              {selectedInquiry && (
                <div className="modal-backdrop" onClick={() => setSelectedInquiry(null)}>
                  <div className="inquiry-drawer-card" onClick={(e) => e.stopPropagation()}>
                    <div className="drawer-header">
                      <div>
                        <span className="drawer-tag">Inquiry #{selectedInquiry._id}</span>
                        <h3>{selectedInquiry.company}</h3>
                        <div className="drawer-contact-pills">
                          <a href={`mailto:${selectedInquiry.email}`} className="contact-pill">
                            <Mail size={12} />
                            <span>{selectedInquiry.email}</span>
                          </a>
                          {selectedInquiry.phone && (
                            <a href={`tel:${selectedInquiry.phone}`} className="contact-pill">
                              <Phone size={12} />
                              <span>{selectedInquiry.phone}</span>
                            </a>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(null)}
                        className="btn-close-drawer"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <div className="drawer-body">
                      {/* 4-Item Spec Matrix */}
                      <div className="spec-matrix-grid">
                        <div className="spec-box">
                          <span className="spec-box-label">Equipment Class</span>
                          <strong className="spec-box-val">{selectedInquiry.category}</strong>
                        </div>
                        <div className="spec-box">
                          <span className="spec-box-label">Configuration</span>
                          <strong className="spec-box-val">{selectedInquiry.configuration || 'Standard'}</strong>
                        </div>
                        <div className="spec-box">
                          <span className="spec-box-label">Fleet Size</span>
                          <strong className="spec-box-val highlight">{selectedInquiry.quantity || '1+'} Cars</strong>
                        </div>
                        <div className="spec-box">
                          <span className="spec-box-label">Commodity</span>
                          <strong className="spec-box-val">{selectedInquiry.commodity || 'General Freight'}</strong>
                        </div>
                      </div>

                      {/* Shipper Message */}
                      <div className="drawer-section">
                        <label className="drawer-label">Shipper Special Instructions / Requirements</label>
                        <div className="shipper-notes-box">
                          {selectedInquiry.message || 'No additional notes provided by shipper.'}
                        </div>
                      </div>

                      {/* Workflow Status Switcher */}
                      <div className="drawer-section">
                        <label className="drawer-label">Update Workflow Status</label>
                        <div className="status-button-group">
                          {['new', 'reviewing', 'contacted', 'closed'].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => handleStatusChange(selectedInquiry._id, st)}
                              className={`status-btn-opt ${selectedInquiry.status === st ? 'active' : ''} ${st}`}
                            >
                              {selectedInquiry.status === st && <Check size={12} />}
                              <span>{st}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Internal Notes */}
                      <div className="drawer-section">
                        <label className="drawer-label">Internal CRC Staff Notes</label>
                        <textarea
                          rows={2}
                          value={internalNoteDraft}
                          onChange={(e) => setInternalNoteDraft(e.target.value)}
                          placeholder="Private team notes regarding car availability, rate benchmarks, or interchange discussions..."
                          className="internal-note-input"
                        />
                        <button
                          type="button"
                          onClick={() => handleStatusChange(selectedInquiry._id, selectedInquiry.status)}
                          className="btn-save-note"
                        >
                          Save Internal Note
                        </button>
                      </div>
                    </div>

                    <div className="drawer-footer">
                      <button
                        type="button"
                        onClick={() => handleDeleteInquiry(selectedInquiry._id)}
                        className="btn-delete-record"
                      >
                        <Trash2 size={13} />
                        <span>Delete Record</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(null)}
                        className="btn-done"
                      >
                        Close Window
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 2: CONSULTATIONS (BOOKINGS)
              ================================================================= */}
          {activeTab === 'bookings' && (
            <div className="tab-container">
              <div className="admin-card-table">
                {bookings.length === 0 ? (
                  <div className="empty-state">
                    <Calendar size={36} />
                    <h4>No consultation calls booked yet</h4>
                    <p>When shippers schedule consultations via the website booking widget, they appear here.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Client / Company</th>
                          <th>Scheduled Date &amp; Time</th>
                          <th>Topic</th>
                          <th>Notes</th>
                          <th>Status</th>
                          <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((b) => (
                          <tr key={b._id}>
                            <td>
                              <div className="table-company">{b.company}</div>
                              <div className="table-sub">{b.name} &bull; {b.email}</div>
                            </td>
                            <td>
                              <div className="table-bold highlight">{b.preferredDate}</div>
                              <div className="table-sub">{b.preferredTimeSlot}</div>
                            </td>
                            <td className="table-bold">{b.topic}</td>
                            <td className="table-notes">{b.notes || '—'}</td>
                            <td>
                              <span className={`status-badge ${b.status}`}>{b.status}</span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div className="btn-action-inline">
                                {b.status !== 'confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleBookingStatus(b._id, 'confirmed')}
                                    className="btn-action-confirm"
                                  >
                                    Confirm
                                  </button>
                                )}
                                {b.status !== 'completed' && (
                                  <button
                                    type="button"
                                    onClick={() => handleBookingStatus(b._id, 'completed')}
                                    className="btn-action-complete"
                                  >
                                    Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: COST ESTIMATOR LOGS
              ================================================================= */}
          {activeTab === 'estimates' && (
            <div className="tab-container">
              <div className="admin-card-table">
                {estimates.length === 0 ? (
                  <div className="empty-state">
                    <Calculator size={36} />
                    <h4>No estimator calculations run yet</h4>
                    <p>When shippers run pricing calculations on the Freight Cost Estimator, the logs are recorded here.</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Reference ID</th>
                          <th>Equipment &amp; Config</th>
                          <th>Lease Term</th>
                          <th>Quantity</th>
                          <th>Indicative Rate</th>
                          <th>Est. Monthly Total</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {estimates.map((est) => (
                          <tr key={est._id || est.estimateReference}>
                            <td>
                              <code className="ref-code">{est.estimateReference}</code>
                            </td>
                            <td>
                              <div className="table-bold">{est.category}</div>
                              <div className="table-sub">{est.configuration}</div>
                            </td>
                            <td className="table-bold">{est.termName || est.leaseType}</td>
                            <td>
                              <span className="car-count-badge">{est.quantity} cars</span>
                            </td>
                            <td>
                              ${est.rates.minMonthlyPerCar} &ndash; ${est.rates.maxMonthlyPerCar}/car
                            </td>
                            <td className="table-bold highlight">
                              ${est.rates.totalMinMonthly?.toLocaleString()} &ndash; ${est.rates.totalMaxMonthly?.toLocaleString()}/mo
                            </td>
                            <td className="table-date">
                              {new Date(est.createdAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 4: WEBSITE CMS STUDIO (COMPREHENSIVE PAGE & SECTION STUDIO)
              ================================================================= */}
          {activeTab === 'cms' && cmsData && (
            <div className="tab-container">
              {/* CMS Navigation Pills */}
              <div className="cms-subtab-bar">
                <button
                  type="button"
                  onClick={() => setCmsSubTab('home')}
                  className={`cms-subtab-pill ${cmsSubTab === 'home' ? 'active' : ''}`}
                >
                  <HomeIcon size={15} />
                  <span>Homepage Studio</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsSubTab('equipment')}
                  className={`cms-subtab-pill ${cmsSubTab === 'equipment' ? 'active' : ''}`}
                >
                  <Train size={15} />
                  <span>Equipment Fleet (7 Classes)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsSubTab('estimator')}
                  className={`cms-subtab-pill ${cmsSubTab === 'estimator' ? 'active' : ''}`}
                >
                  <Calculator size={15} />
                  <span>Cost Estimator Pricing</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsSubTab('partnerships')}
                  className={`cms-subtab-pill ${cmsSubTab === 'partnerships' ? 'active' : ''}`}
                >
                  <Layers size={15} />
                  <span>Railroad Partnerships</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsSubTab('about')}
                  className={`cms-subtab-pill ${cmsSubTab === 'about' ? 'active' : ''}`}
                >
                  <Info size={15} />
                  <span>About Us &amp; Leadership</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsSubTab('values')}
                  className={`cms-subtab-pill ${cmsSubTab === 'values' ? 'active' : ''}`}
                >
                  <Award size={15} />
                  <span>Company Values (6 Principles)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsSubTab('contact')}
                  className={`cms-subtab-pill ${cmsSubTab === 'contact' ? 'active' : ''}`}
                >
                  <Building2 size={15} />
                  <span>Contact Info &amp; Ribbon</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCmsSubTab('faqs')}
                  className={`cms-subtab-pill ${cmsSubTab === 'faqs' ? 'active' : ''}`}
                >
                  <HelpCircle size={15} />
                  <span>FAQ Manager</span>
                </button>
              </div>

              {/* =============================================================
                  SUB-PANE 1: HOMEPAGE STUDIO
                  ============================================================= */}
              {cmsSubTab === 'home' && (
                <div className="cms-subtab-pane">
                  {/* Hero Section */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Homepage &bull; Section 01</div>
                      <h3>Hero Banner &amp; Primary Value Proposition</h3>
                      <p>Edit the top hero headline, description, background image, and CTA labels.</p>
                    </div>

                    <div className="cms-form-grid">
                      <div className="cms-field full-width">
                        <label>Hero Eyebrow Super-heading</label>
                        <input
                          type="text"
                          value={cmsData.home?.hero?.eyebrow ?? cmsData.hero?.eyebrow ?? ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                hero: { ...cmsData.home?.hero, eyebrow: e.target.value },
                              },
                              hero: { ...cmsData.hero, eyebrow: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Primary Main Headline (H1)</label>
                        <input
                          type="text"
                          value={cmsData.home?.hero?.headline ?? cmsData.hero?.headline ?? ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                hero: { ...cmsData.home?.hero, headline: e.target.value },
                              },
                              hero: { ...cmsData.hero, headline: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Subheadline Lead Description</label>
                        <textarea
                          rows={3}
                          value={cmsData.home?.hero?.subheadline ?? cmsData.hero?.subheadline ?? ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                hero: { ...cmsData.home?.hero, subheadline: e.target.value },
                              },
                              hero: { ...cmsData.hero, subheadline: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <ImageDropzone
                          label="Hero Background Image (Drag & Drop or Click)"
                          category="hero"
                          value={cmsData.home?.hero?.bgImage ?? cmsData.hero?.bgImage ?? '/images/hero/DSC_0004.jpg'}
                          onChange={(newUrl) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                hero: { ...cmsData.home?.hero, bgImage: newUrl },
                              },
                              hero: { ...cmsData.hero, bgImage: newUrl },
                            })
                          }
                          helperText="Drop high-resolution train/yard photo. Automatically compressed to WebP. Previous uploaded image will be automatically deleted from disk."
                        />
                      </div>

                      <div className="cms-field">
                        <label>Primary CTA Button Label</label>
                        <input
                          type="text"
                          value={cmsData.home?.hero?.ctaPrimaryText ?? 'Request Equipment Availability'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                hero: { ...cmsData.home?.hero, ctaPrimaryText: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Secondary CTA Button Label</label>
                        <input
                          type="text"
                          value={cmsData.home?.hero?.ctaSecondaryText ?? 'Explore Fleet Catalog'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                hero: { ...cmsData.home?.hero, ctaSecondaryText: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Services Cards (4 Cards) */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Homepage &bull; Section 02</div>
                      <h3>Core Commercial Services &bull; Section Header &amp; 4 Program Cards</h3>
                      <p>Customize the section title, introductory description, and each of the 4 service program cards.</p>
                    </div>

                    <div className="cms-form-grid" style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                      <div className="cms-field full-width">
                        <label>Section 02 Main Title</label>
                        <input
                          type="text"
                          value={cmsData.home?.servicesHeader?.title ?? 'Comprehensive Rail Equipment & Sourcing Services'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                servicesHeader: {
                                  ...cmsData.home?.servicesHeader,
                                  title: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                      <div className="cms-field full-width">
                        <label>Section 02 Introductory Subtitle / Description</label>
                        <textarea
                          rows={2}
                          value={cmsData.home?.servicesHeader?.desc ?? 'From initial fleet sizing to Class I interchange and routine mechanical maintenance, Coast Road Capital provides end-to-end support for industrial shippers across North America.'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                servicesHeader: {
                                  ...cmsData.home?.servicesHeader,
                                  desc: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="card-editor-grid">
                      {(cmsData.home?.services || []).map((srv, srvIdx) => (
                        <div key={srv.id || srvIdx} className="card-editor-item">
                          <div className="card-editor-header">
                            <span className="card-editor-badge">Card 0{srvIdx + 1} &bull; {srv.id}</span>
                            <strong className="card-editor-title">{srv.title}</strong>
                          </div>

                          <div className="cms-form-grid single-col">
                            <div className="cms-field">
                              <label>Service Title</label>
                              <input
                                type="text"
                                value={srv.title}
                                onChange={(e) => {
                                  const updated = [...(cmsData.home?.services || [])];
                                  updated[srvIdx] = { ...updated[srvIdx], title: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    home: { ...cmsData.home, services: updated },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Subtitle / One-line Summary</label>
                              <input
                                type="text"
                                value={srv.subtitle}
                                onChange={(e) => {
                                  const updated = [...(cmsData.home?.services || [])];
                                  updated[srvIdx] = { ...updated[srvIdx], subtitle: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    home: { ...cmsData.home, services: updated },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Action Link Label</label>
                              <input
                                type="text"
                                value={srv.linkText || ''}
                                onChange={(e) => {
                                  const updated = [...(cmsData.home?.services || [])];
                                  updated[srvIdx] = { ...updated[srvIdx], linkText: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    home: { ...cmsData.home, services: updated },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Bullet Point 1</label>
                              <input
                                type="text"
                                value={srv.points?.[0] || ''}
                                onChange={(e) => {
                                  const updated = [...(cmsData.home?.services || [])];
                                  const pts = [...(updated[srvIdx].points || [])];
                                  pts[0] = e.target.value;
                                  updated[srvIdx] = { ...updated[srvIdx], points: pts };
                                  setCmsData({
                                    ...cmsData,
                                    home: { ...cmsData.home, services: updated },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Bullet Point 2</label>
                              <input
                                type="text"
                                value={srv.points?.[1] || ''}
                                onChange={(e) => {
                                  const updated = [...(cmsData.home?.services || [])];
                                  const pts = [...(updated[srvIdx].points || [])];
                                  pts[1] = e.target.value;
                                  updated[srvIdx] = { ...updated[srvIdx], points: pts };
                                  setCmsData({
                                    ...cmsData,
                                    home: { ...cmsData.home, services: updated },
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* =========================================================
                      SECTION 04: WHO WE ARE (BUILT FOR SHIPPERS)
                      ========================================================= */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Homepage &bull; Section 04</div>
                      <h3>Who We Are &bull; Built For Shippers (Tampa HQ)</h3>
                      <p>Customize the eyebrow, headline, story paragraphs, callout cards, CTA buttons, and featured photo.</p>
                    </div>

                    <div className="cms-form-grid">
                      <div className="cms-field">
                        <label>Section Eyebrow Super-heading</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.eyebrow ?? 'Who We Are'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, eyebrow: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Section Headline (H2)</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.title ?? 'Built For Shippers. Anchored in Tampa, Serving North America.'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Paragraph 1 (Primary Value Narrative)</label>
                        <textarea
                          rows={3}
                          value={cmsData.home?.whoWeAre?.p1 ?? ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, p1: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Paragraph 2 (Tampa HQ &amp; Rail Expertise)</label>
                        <textarea
                          rows={3}
                          value={cmsData.home?.whoWeAre?.p2 ?? ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, p2: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Callout Badge 1 &bull; Title</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.callout1Title ?? 'Operating Values'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, callout1Title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Callout Badge 1 &bull; Subtitle</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.callout1Sub ?? 'Safety & transparent terms'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, callout1Sub: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Callout Badge 2 &bull; Title</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.callout2Title ?? 'Leasing FAQs'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, callout2Title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Callout Badge 2 &bull; Subtitle</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.callout2Sub ?? 'Net vs full-service & siding'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, callout2Sub: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Primary Button Label</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.btn1Text ?? 'About Coast Road Capital'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, btn1Text: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Secondary Button Label</label>
                        <input
                          type="text"
                          value={cmsData.home?.whoWeAre?.btn2Text ?? 'Contact Tampa HQ'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, btn2Text: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <ImageDropzone
                          label="Feature Operational Photo (Drag & Drop or Click)"
                          category="operations"
                          value={cmsData.home?.whoWeAre?.image ?? '/images/Trains serving industries-additional railcar images/DSC06309 (1).jpg'}
                          onChange={(newUrl) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                whoWeAre: { ...cmsData.home?.whoWeAre, image: newUrl },
                              },
                            })
                          }
                          helperText="Featured siding/switching operations photo. Auto-compressed to WebP."
                        />
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      SECTION 06: COST ESTIMATOR CALLOUT
                      ========================================================= */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Homepage &bull; Section 06</div>
                      <h3>Cost Estimator Callout &bull; Interactive Calculator Teaser</h3>
                      <p>Customize the headline, descriptive copy, 2 feature highlight points, and CTA button labels.</p>
                    </div>

                    <div className="cms-form-grid">
                      <div className="cms-field full-width">
                        <label>Section Headline (H2)</label>
                        <input
                          type="text"
                          value={cmsData.home?.estimatorCallout?.title ?? 'Model Real-Time Equipment Lease Rates Before Committing Capital'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Narrative Description</label>
                        <textarea
                          rows={3}
                          value={cmsData.home?.estimatorCallout?.desc ?? "Eliminate the guesswork of freight logistics budgeting. Model realistic per-car and fleet monthly lease costs across North America's seven primary equipment classes in seconds — with instant maintenance scope comparisons."}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, desc: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Feature 1 &bull; Headline</label>
                        <input
                          type="text"
                          value={cmsData.home?.estimatorCallout?.feature1Title ?? '7 Railcar Categories & Sizing Specs'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, feature1Title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Feature 1 &bull; Description</label>
                        <textarea
                          rows={2}
                          value={cmsData.home?.estimatorCallout?.feature1Desc ?? 'Detailed cubic volume, GRL weight limits, and commodity matching across Boxcars, Hoppers, Gondolas, Flatcars, and Tank Cars.'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, feature1Desc: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Feature 2 &bull; Headline</label>
                        <input
                          type="text"
                          value={cmsData.home?.estimatorCallout?.feature2Title ?? 'Full-Service vs. Net Lease Modeling'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, feature2Title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Feature 2 &bull; Description</label>
                        <textarea
                          rows={2}
                          value={cmsData.home?.estimatorCallout?.feature2Desc ?? 'Compare lessor-managed AAR Rule 88 mechanical maintenance and wheelset renewals against shipper-managed net leases.'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, feature2Desc: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Primary Button Label</label>
                        <input
                          type="text"
                          value={cmsData.home?.estimatorCallout?.btn1Text ?? 'Launch Cost Estimator'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, btn1Text: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Secondary Button Label</label>
                        <input
                          type="text"
                          value={cmsData.home?.estimatorCallout?.btn2Text ?? 'View Full Catalog'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                estimatorCallout: { ...cmsData.home?.estimatorCallout, btn2Text: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* =========================================================
                      SECTION 07: DELIVERY PROCESS (3 STEPS)
                      ========================================================= */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Homepage &bull; Section 07</div>
                      <h3>Step-by-Step Delivery Workflow (3 Sourcing Milestones)</h3>
                      <p>Customize the section title, eyebrow, and all 3 delivery milestone step cards with their checklist points.</p>
                    </div>

                    <div className="cms-form-grid" style={{ marginBottom: '1.75rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
                      <div className="cms-field">
                        <label>Section Eyebrow Super-heading</label>
                        <input
                          type="text"
                          value={cmsData.home?.deliveryProcess?.eyebrow ?? 'Step-by-Step Delivery'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                deliveryProcess: { ...cmsData.home?.deliveryProcess, eyebrow: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Section Headline (H2)</label>
                        <input
                          type="text"
                          value={cmsData.home?.deliveryProcess?.title ?? 'How Railcar Equipment Reaches Your Siding'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                deliveryProcess: { ...cmsData.home?.deliveryProcess, title: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Section Introductory Subtitle</label>
                        <textarea
                          rows={2}
                          value={cmsData.home?.deliveryProcess?.desc ?? 'A straightforward, transparent three-step process from initial specification matching to on-track delivery.'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              home: {
                                ...cmsData.home,
                                deliveryProcess: { ...cmsData.home?.deliveryProcess, desc: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="card-editor-grid">
                      {[0, 1, 2].map((sIdx) => {
                        const defaultSteps = [
                          {
                            num: '01',
                            title: 'Match & Verify Equipment',
                            desc: 'We analyze your commodity, loading rack clearances, and siding curvature against AAR dimensions and weight limits.',
                            checks: ['Clearance & dock alignment', 'Payload density optimization', 'Discharge interface matching'],
                          },
                          {
                            num: '02',
                            title: 'Sourcing & Terms',
                            desc: 'We secure the car set from verified regional pools and prepare flexible full-service or net lease structures.',
                            checks: ['Regional car set sourcing', 'Full-service vs. net lease options', 'Delivery timeline commitment'],
                          },
                          {
                            num: '03',
                            title: 'Inspection & Delivery',
                            desc: 'Pre-trip mechanical certification is completed and Class I interchange routing delivers the cars directly to your facility siding.',
                            checks: ['Pre-trip mechanical sign-off', 'Class I interchange dispatch', 'Dedicated commercial contact throughout'],
                          },
                        ];
                        const step = cmsData.home?.deliveryProcess?.steps?.[sIdx] || defaultSteps[sIdx];

                        const updateStepField = (field: 'num' | 'title' | 'desc', val: string) => {
                          const currentSteps = [...(cmsData.home?.deliveryProcess?.steps || defaultSteps)];
                          currentSteps[sIdx] = { ...currentSteps[sIdx], [field]: val };
                          setCmsData({
                            ...cmsData,
                            home: {
                              ...cmsData.home,
                              deliveryProcess: { ...cmsData.home?.deliveryProcess, steps: currentSteps },
                            },
                          });
                        };

                        const updateStepCheck = (chkIdx: number, val: string) => {
                          const currentSteps = [...(cmsData.home?.deliveryProcess?.steps || defaultSteps)];
                          const currentChecks = [...(currentSteps[sIdx]?.checks || defaultSteps[sIdx].checks)];
                          currentChecks[chkIdx] = val;
                          currentSteps[sIdx] = { ...currentSteps[sIdx], checks: currentChecks };
                          setCmsData({
                            ...cmsData,
                            home: {
                              ...cmsData.home,
                              deliveryProcess: { ...cmsData.home?.deliveryProcess, steps: currentSteps },
                            },
                          });
                        };

                        return (
                          <div key={sIdx} className="card-editor-item">
                            <div className="card-editor-header">
                              <span className="card-editor-badge">Milestone Step {step.num || `0${sIdx + 1}`}</span>
                              <strong className="card-editor-title">{step.title}</strong>
                            </div>

                            <div className="cms-form-grid single-col">
                              <div className="cms-field">
                                <label>Step Number Badge</label>
                                <input
                                  type="text"
                                  value={step.num || `0${sIdx + 1}`}
                                  onChange={(e) => updateStepField('num', e.target.value)}
                                />
                              </div>

                              <div className="cms-field">
                                <label>Step Headline</label>
                                <input
                                  type="text"
                                  value={step.title || ''}
                                  onChange={(e) => updateStepField('title', e.target.value)}
                                />
                              </div>

                              <div className="cms-field">
                                <label>Step Narrative Description</label>
                                <textarea
                                  rows={3}
                                  value={step.desc || ''}
                                  onChange={(e) => updateStepField('desc', e.target.value)}
                                />
                              </div>

                              <div className="cms-field">
                                <label>Checklist Point 1</label>
                                <input
                                  type="text"
                                  value={step.checks?.[0] || ''}
                                  onChange={(e) => updateStepCheck(0, e.target.value)}
                                />
                              </div>

                              <div className="cms-field">
                                <label>Checklist Point 2</label>
                                <input
                                  type="text"
                                  value={step.checks?.[1] || ''}
                                  onChange={(e) => updateStepCheck(1, e.target.value)}
                                />
                              </div>

                              <div className="cms-field">
                                <label>Checklist Point 3</label>
                                <input
                                  type="text"
                                  value={step.checks?.[2] || ''}
                                  onChange={(e) => updateStepCheck(2, e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-PANE: RAILROAD PARTNERSHIPS STUDIO
                  ============================================================= */}
              {cmsSubTab === 'partnerships' && (
                <div className="cms-subtab-pane">
                  {/* Railroad Support Bento Grid (6 Bento Cards) */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Railroad Partnerships &bull; Bento Grid</div>
                      <h3>"How We Can Support Your Railroad" (6 Bento Cards)</h3>
                      <p>Customize each card of the Pinterest-style Bento grid on Railroad Partnerships.</p>
                    </div>

                    <div className="card-editor-grid">
                      {(cmsData.railroadPartnerships?.bentoCards || []).map((card, cIdx) => (
                        <div key={card.id || cIdx} className="card-editor-item">
                          <div className="card-editor-header">
                            <span className="card-editor-badge">Bento 0{cIdx + 1} &bull; {card.label || card.badge}</span>
                            <strong className="card-editor-title">{card.title}</strong>
                          </div>

                          <div className="cms-form-grid single-col">
                            <div className="cms-field">
                              <label>Card Tag / Category Badge</label>
                              <input
                                type="text"
                                value={card.label || card.badge || ''}
                                onChange={(e) => {
                                  const updated = [...(cmsData.railroadPartnerships?.bentoCards || [])];
                                  updated[cIdx] = { ...updated[cIdx], label: e.target.value, badge: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    railroadPartnerships: {
                                      ...cmsData.railroadPartnerships,
                                      bentoCards: updated,
                                    },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Card Headline</label>
                              <input
                                type="text"
                                value={card.title}
                                onChange={(e) => {
                                  const updated = [...(cmsData.railroadPartnerships?.bentoCards || [])];
                                  updated[cIdx] = { ...updated[cIdx], title: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    railroadPartnerships: {
                                      ...cmsData.railroadPartnerships,
                                      bentoCards: updated,
                                    },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Narrative Description</label>
                              <textarea
                                rows={3}
                                value={card.desc}
                                onChange={(e) => {
                                  const updated = [...(cmsData.railroadPartnerships?.bentoCards || [])];
                                  updated[cIdx] = { ...updated[cIdx], desc: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    railroadPartnerships: {
                                      ...cmsData.railroadPartnerships,
                                      bentoCards: updated,
                                    },
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Partner Carrier Form Header */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Carrier Form &bull; Introduction</div>
                      <h3>"Partner With Coast Road Capital" Carrier Section</h3>
                      <p>Customize the headline and narrative description for the carrier partnership form.</p>
                    </div>

                    <div className="cms-form-grid single-col">
                      <div className="cms-field">
                        <label>Section Title</label>
                        <input
                          type="text"
                          value={cmsData.railroadPartnerships?.partnerCarrier?.title || 'Partner With Coast Road Capital'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              railroadPartnerships: {
                                ...cmsData.railroadPartnerships,
                                partnerCarrier: {
                                  ...cmsData.railroadPartnerships?.partnerCarrier,
                                  title: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Introductory Paragraph</label>
                        <textarea
                          rows={3}
                          value={cmsData.railroadPartnerships?.partnerCarrier?.desc || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              railroadPartnerships: {
                                ...cmsData.railroadPartnerships,
                                partnerCarrier: {
                                  ...cmsData.railroadPartnerships?.partnerCarrier,
                                  desc: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-PANE 2: EQUIPMENT CATALOG STUDIO (ALL 7 CAR CLASSES)
                  ============================================================= */}
              {cmsSubTab === 'equipment' && (
                <div className="cms-subtab-pane">
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Fleet Catalog &bull; All 7 Equipment Classes</div>
                      <h3>Railcar Equipment Classes &amp; Rate Configuration</h3>
                      <p>Update names, rates, images, commodities, and availability status for every railcar category.</p>
                    </div>

                    <div className="equipment-overrides-list">
                      {(cmsData.equipmentOverrides || []).map((eq, idx) => (
                        <div key={eq.id || idx} className="equipment-editor-card">
                          <div className="eq-editor-header">
                            <div className="eq-title-wrap">
                              <strong className="eq-name">{eq.name}</strong>
                              <span className="eq-badge">{eq.id}</span>
                            </div>
                            <span className="eq-rate-tag">${eq.baseMonthlyRate}/car/mo</span>
                          </div>

                          <div className="cms-form-grid">
                            <div className="cms-field">
                              <label>Category Display Name</label>
                              <input
                                type="text"
                                value={eq.name}
                                onChange={(e) => {
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], name: e.target.value };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Category Subtitle / Class</label>
                              <input
                                type="text"
                                value={eq.subtitle || ''}
                                onChange={(e) => {
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], subtitle: e.target.value };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Base Monthly Lease Rate ($ / car / mo)</label>
                              <input
                                type="number"
                                value={eq.baseMonthlyRate}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], baseMonthlyRate: val };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Availability Status Badge</label>
                              <input
                                type="text"
                                value={eq.availableStatus}
                                onChange={(e) => {
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], availableStatus: e.target.value };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                              />
                            </div>

                            <div className="cms-field full-width">
                              <ImageDropzone
                                label={`${eq.name} Photo (Drag & Drop or Click)`}
                                category="equipment"
                                value={eq.image || ''}
                                onChange={(newUrl) => {
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], image: newUrl };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                                helperText="Drop freight car photograph. Auto-compressed to WebP."
                              />
                            </div>

                            <div className="cms-field full-width">
                              <label>Primary Technical Description</label>
                              <textarea
                                rows={2}
                                value={eq.description}
                                onChange={(e) => {
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], description: e.target.value };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                              />
                            </div>

                            <div className="cms-field full-width">
                              <label>Typical Commodities (comma separated)</label>
                              <input
                                type="text"
                                value={eq.typicalCommodities}
                                onChange={(e) => {
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], typicalCommodities: e.target.value };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                              />
                            </div>

                            <div className="cms-field full-width">
                              <label>Configurations &amp; Capacities Line</label>
                              <input
                                type="text"
                                value={eq.capacities || ''}
                                onChange={(e) => {
                                  const updated = [...cmsData.equipmentOverrides];
                                  updated[idx] = { ...updated[idx], capacities: e.target.value };
                                  setCmsData({ ...cmsData, equipmentOverrides: updated });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-PANE: COST ESTIMATOR PRICING & RATE ENGINE
                  ============================================================= */}
              {cmsSubTab === 'estimator' && (
                <div className="cms-subtab-pane">
                  {/* Studio Banner */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Cost Estimator &bull; Pricing Engine</div>
                      <h3>Cost Estimator &amp; Real-Time Rate Engine</h3>
                      <p>
                        Full administrative control over equipment base lease pricing, duration multipliers, volume discount tiers, and interchange gateways. All changes instantly update the interactive calculator on <strong>/cost-estimator</strong> and the homepage benchmark card.
                      </p>
                    </div>
                  </div>

                  {/* Section 1: Equipment Base Monthly Rates (7 Car Classes) */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Equipment Baseline Pricing</div>
                      <h3>Equipment Base Monthly Lease Rates (All 7 Car Classes)</h3>
                      <p>Configure the baseline Min and Max per-car monthly rates for Net Leases (shipper maintained) vs. Full-Service Leases (CRC maintenance included).</p>
                    </div>

                    <div className="card-editor-grid">
                      {(() => {
                        const defaultCategoryRates = [
                          { id: 'boxcars', name: 'Boxcars', baseNetMin: 475, baseNetMax: 750, baseFullMin: 650, baseFullMax: 980, truckloadEquivalent: 3.5, avgPayloadTons: 90 },
                          { id: 'covered-hoppers', name: 'Covered Hoppers', baseNetMin: 520, baseNetMax: 850, baseFullMin: 700, baseFullMax: 1150, truckloadEquivalent: 4.0, avgPayloadTons: 105 },
                          { id: 'open-top-hoppers', name: 'Open-Top Hoppers', baseNetMin: 420, baseNetMax: 680, baseFullMin: 590, baseFullMax: 890, truckloadEquivalent: 4.2, avgPayloadTons: 105 },
                          { id: 'gondolas', name: 'Gondolas', baseNetMin: 450, baseNetMax: 720, baseFullMin: 620, baseFullMax: 940, truckloadEquivalent: 4.0, avgPayloadTons: 102 },
                          { id: 'centerbeam-flatcars', name: 'Centerbeam Flatcars', baseNetMin: 490, baseNetMax: 780, baseFullMin: 670, baseFullMax: 990, truckloadEquivalent: 3.8, avgPayloadTons: 98 },
                          { id: 'bulkhead-flatcars', name: 'General-Purpose & Bulkhead Flatcars', baseNetMin: 460, baseNetMax: 740, baseFullMin: 630, baseFullMax: 950, truckloadEquivalent: 3.7, avgPayloadTons: 95 },
                          { id: 'tank-cars', name: 'Tank Cars', baseNetMin: 680, baseNetMax: 1150, baseFullMin: 880, baseFullMax: 1480, truckloadEquivalent: 3.5, avgPayloadTons: 110 },
                        ];
                        const currentRates = cmsData.costEstimator?.categoryRates && cmsData.costEstimator.categoryRates.length > 0
                          ? cmsData.costEstimator.categoryRates
                          : defaultCategoryRates;

                        const updateRate = (idx: number, field: string, val: number) => {
                          const updated = currentRates.map((r, i) => (i === idx ? { ...r, [field]: val } : r));
                          setCmsData({
                            ...cmsData,
                            costEstimator: {
                              ...cmsData.costEstimator,
                              categoryRates: updated,
                              termFactors: cmsData.costEstimator?.termFactors || [],
                              volumeTiers: cmsData.costEstimator?.volumeTiers || [],
                              regionFactors: cmsData.costEstimator?.regionFactors || [],
                            },
                          });
                        };

                        return currentRates.map((rate, rIdx) => {
                          const netMin = rate.baseNetMin || 0;
                          const netMax = rate.baseNetMax || 0;
                          const fullMin = rate.baseFullMin || 0;
                          const fullMax = rate.baseFullMax || 0;
                          const spreadMin = fullMin - netMin;
                          const spreadMax = fullMax - netMax;

                          return (
                            <div key={rate.id || rIdx} className="card-editor-item">
                              <div className="card-editor-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <span className="card-editor-badge">Class 0{rIdx + 1}</span>
                                  <strong className="card-editor-title">{rate.name}</strong>
                                </div>
                                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#AA2E1F', backgroundColor: '#FDF2F0', padding: '0.2rem 0.55rem', borderRadius: '4px' }}>
                                  Maint. Delta: +${spreadMin > 0 ? spreadMin : 0} to +${spreadMax > 0 ? spreadMax : 0}/mo
                                </span>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.85rem', marginBottom: '0.75rem' }}>
                                <div className="cms-field">
                                  <label style={{ fontSize: '0.76rem' }}>Net Lease Min ($)</label>
                                  <input
                                    type="number"
                                    value={rate.baseNetMin}
                                    onChange={(e) => updateRate(rIdx, 'baseNetMin', Number(e.target.value))}
                                  />
                                </div>

                                <div className="cms-field">
                                  <label style={{ fontSize: '0.76rem' }}>Net Lease Max ($)</label>
                                  <input
                                    type="number"
                                    value={rate.baseNetMax}
                                    onChange={(e) => updateRate(rIdx, 'baseNetMax', Number(e.target.value))}
                                  />
                                </div>

                                <div className="cms-field">
                                  <label style={{ fontSize: '0.76rem' }}>Full-Service Min ($)</label>
                                  <input
                                    type="number"
                                    value={rate.baseFullMin}
                                    onChange={(e) => updateRate(rIdx, 'baseFullMin', Number(e.target.value))}
                                  />
                                </div>

                                <div className="cms-field">
                                  <label style={{ fontSize: '0.76rem' }}>Full-Service Max ($)</label>
                                  <input
                                    type="number"
                                    value={rate.baseFullMax}
                                    onChange={(e) => updateRate(rIdx, 'baseFullMax', Number(e.target.value))}
                                  />
                                </div>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed #E2E8F0' }}>
                                <div className="cms-field">
                                  <label style={{ fontSize: '0.74rem', color: '#64748B' }}>Avg Payload (Tons)</label>
                                  <input
                                    type="number"
                                    value={rate.avgPayloadTons || 100}
                                    onChange={(e) => updateRate(rIdx, 'avgPayloadTons', Number(e.target.value))}
                                  />
                                </div>
                                <div className="cms-field">
                                  <label style={{ fontSize: '0.74rem', color: '#64748B' }}>Truckload Ratio (x/car)</label>
                                  <input
                                    type="number"
                                    step="0.1"
                                    value={rate.truckloadEquivalent || 3.5}
                                    onChange={(e) => updateRate(rIdx, 'truckloadEquivalent', Number(e.target.value))}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  {/* Section 2: Term Duration Factors & Volume Tiers (Side-by-Side) */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Lease Term Multipliers */}
                    <div className="cms-card" style={{ margin: 0 }}>
                      <div className="cms-card-header">
                        <div className="cms-card-tag">Term Durations</div>
                        <h3>Lease Term Multipliers</h3>
                        <p>Adjust multiplier factors applied to monthly lease rates based on commitment duration.</p>
                      </div>

                      <div className="cms-form-grid single-col">
                        {(() => {
                          const defaultTerms = [
                            { id: 'short', name: 'Short-Term / Surge (3–12 Mos)', factor: 1.12, note: 'Higher monthly rate for seasonal peaks or bridge capacity' },
                            { id: 'medium', name: 'Medium-Term (1–3 Years)', factor: 1.0, note: 'Standard commercial leasing market baseline' },
                            { id: 'long', name: 'Long-Term (3–5+ Years)', factor: 0.9, note: 'Discounted monthly rate for multi-year capital commitment' },
                          ];
                          const currentTerms = cmsData.costEstimator?.termFactors && cmsData.costEstimator.termFactors.length > 0
                            ? cmsData.costEstimator.termFactors
                            : defaultTerms;

                          const updateTermFactor = (idx: number, val: number) => {
                            const updated = currentTerms.map((t, i) => (i === idx ? { ...t, factor: val } : t));
                            setCmsData({
                              ...cmsData,
                              costEstimator: {
                                ...cmsData.costEstimator,
                                categoryRates: cmsData.costEstimator?.categoryRates || [],
                                termFactors: updated,
                                volumeTiers: cmsData.costEstimator?.volumeTiers || [],
                                regionFactors: cmsData.costEstimator?.regionFactors || [],
                              },
                            });
                          };

                          return currentTerms.map((term, tIdx) => (
                            <div key={term.id} className="cms-field">
                              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{term.name}</span>
                                <span style={{ fontSize: '0.78rem', color: term.factor > 1 ? '#B45309' : term.factor < 1 ? '#047857' : '#64748B', fontWeight: 600 }}>
                                  {term.factor > 1 ? `+${Math.round((term.factor - 1) * 100)}% Surge` : term.factor < 1 ? `-${Math.round((1 - term.factor) * 100)}% Discount` : '1.0 Baseline'}
                                </span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={term.factor}
                                onChange={(e) => updateTermFactor(tIdx, Number(e.target.value))}
                              />
                              <span className="field-hint">{term.note || ''} (e.g. 1.12 for 12% premium, 0.90 for 10% discount)</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Fleet Volume Discount Tiers */}
                    <div className="cms-card" style={{ margin: 0 }}>
                      <div className="cms-card-header">
                        <div className="cms-card-tag">Volume Scaling</div>
                        <h3>Fleet Volume Discount Tiers</h3>
                        <p>Configure percentage discounts automatically awarded as shipper fleet car count increases.</p>
                      </div>

                      <div className="cms-form-grid single-col">
                        {(() => {
                          const defaultTiers = [
                            { minQty: 5, discountPercent: 2 },
                            { minQty: 10, discountPercent: 4 },
                            { minQty: 20, discountPercent: 7 },
                            { minQty: 50, discountPercent: 10 },
                          ];
                          const currentTiers = cmsData.costEstimator?.volumeTiers && cmsData.costEstimator.volumeTiers.length > 0
                            ? cmsData.costEstimator.volumeTiers
                            : defaultTiers;

                          const updateTier = (idx: number, val: number) => {
                            const updated = currentTiers.map((tier, i) => (i === idx ? { ...tier, discountPercent: val } : tier));
                            setCmsData({
                              ...cmsData,
                              costEstimator: {
                                ...cmsData.costEstimator,
                                categoryRates: cmsData.costEstimator?.categoryRates || [],
                                termFactors: cmsData.costEstimator?.termFactors || [],
                                volumeTiers: updated,
                                regionFactors: cmsData.costEstimator?.regionFactors || [],
                              },
                            });
                          };

                          return currentTiers.map((tier, tierIdx) => (
                            <div key={tier.minQty} className="cms-field">
                              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{tier.minQty}+ Cars Fleet Tier</span>
                                <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
                                  {tier.discountPercent}% Discount
                                </span>
                              </label>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <input
                                  type="number"
                                  min="0"
                                  max="50"
                                  value={tier.discountPercent}
                                  onChange={(e) => updateTier(tierIdx, Number(e.target.value))}
                                />
                                <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>%</span>
                              </div>
                              <span className="field-hint">Shippers with {tier.minQty} or more cars receive a {tier.discountPercent}% discount</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Interchange Regions & Gateways */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Interchange Gateways</div>
                      <h3>Delivery Region &amp; Interchange Routing Factors</h3>
                      <p>Adjust geographic repositioning multipliers based on continental gateway and Class I carrier clearance costs.</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                      {(() => {
                        const defaultRegions = [
                          { id: 'gulf-coast', name: 'Gulf Coast / Houston Rail Hub (Class I Trunklines)', factor: 1.0 },
                          { id: 'midwest', name: 'Midwest / Chicago Gateway', factor: 1.02 },
                          { id: 'southeast', name: 'Southeast / Atlanta & Jacksonville Corridors', factor: 1.03 },
                          { id: 'southwest-west', name: 'Southwest / Western Siding', factor: 1.05 },
                          { id: 'pnw', name: 'Pacific Northwest Corridors', factor: 1.06 },
                          { id: 'canada-border', name: 'Canada / Cross-Border Transits', factor: 1.08 },
                        ];
                        const currentRegions = cmsData.costEstimator?.regionFactors && cmsData.costEstimator.regionFactors.length > 0
                          ? cmsData.costEstimator.regionFactors
                          : defaultRegions;

                        const updateRegion = (idx: number, val: number) => {
                          const updated = currentRegions.map((r, i) => (i === idx ? { ...r, factor: val } : r));
                          setCmsData({
                            ...cmsData,
                            costEstimator: {
                              ...cmsData.costEstimator,
                              categoryRates: cmsData.costEstimator?.categoryRates || [],
                              termFactors: cmsData.costEstimator?.termFactors || [],
                              volumeTiers: cmsData.costEstimator?.volumeTiers || [],
                              regionFactors: updated,
                            },
                          });
                        };

                        return currentRegions.map((region, rIdx) => (
                          <div key={region.id} style={{ padding: '1rem', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                            <strong style={{ display: 'block', fontSize: '0.88rem', color: '#0A0A09', marginBottom: '0.5rem' }}>
                              {region.name}
                            </strong>
                            <div className="cms-field" style={{ margin: 0 }}>
                              <label style={{ fontSize: '0.74rem' }}>Multiplier Factor</label>
                              <input
                                type="number"
                                step="0.01"
                                value={region.factor}
                                onChange={(e) => updateRegion(rIdx, Number(e.target.value))}
                              />
                              <span className="field-hint">e.g. 1.00 = parity, 1.05 = +5% positioning fee</span>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-PANE 3: ABOUT US & LEADERSHIP STUDIO
                  ============================================================= */}
              {cmsSubTab === 'about' && (
                <div className="cms-subtab-pane">
                  {/* Hero */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">About Page &bull; Header</div>
                      <h3>About Page Hero &amp; Background Image</h3>
                      <p>Customize the headline and introduction shown at the top of /about.</p>
                    </div>

                    <div className="cms-form-grid single-col">
                      <div className="cms-field">
                        <label>Hero Eyebrow</label>
                        <input
                          type="text"
                          value={cmsData.about?.hero?.eyebrow || 'Corporate Heritage • Leadership • Operating Philosophy'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                hero: { ...cmsData.about?.hero, eyebrow: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Main Headline</label>
                        <input
                          type="text"
                          value={cmsData.about?.hero?.headline || 'About Coast Road Capital'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                hero: { ...cmsData.about?.hero, headline: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Subtitle Description</label>
                        <textarea
                          rows={2}
                          value={cmsData.about?.hero?.subheadline || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                hero: { ...cmsData.about?.hero, subheadline: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <ImageDropzone
                          label="About Hero Background Image (Drag & Drop or Click)"
                          category="hero"
                          value={cmsData.about?.hero?.bgImage || '/images/hero/DSC_0004.jpg'}
                          onChange={(newUrl) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                hero: { ...cmsData.about?.hero, bgImage: newUrl },
                              },
                            })
                          }
                          helperText="Header banner photo for /about. Auto-compressed to WebP."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Our History & Identity Narrative */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">About Page &bull; Section 01</div>
                      <h3>Our History &amp; Identity Narrative</h3>
                      <p>Edit the three foundational storytelling paragraphs regarding railroad heritage.</p>
                    </div>

                    <div className="cms-form-grid single-col">
                      <div className="cms-field">
                        <label>Section Headline</label>
                        <input
                          type="text"
                          value={cmsData.about?.heritage?.headline || 'Our History & Identity'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                heritage: { ...cmsData.about?.heritage, headline: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Paragraph 1: Historic Railroad Inspiration</label>
                        <textarea
                          rows={3}
                          value={cmsData.about?.heritage?.p1 || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                heritage: { ...cmsData.about?.heritage, p1: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Paragraph 2: Visual Identity &amp; Speed Lettering</label>
                        <textarea
                          rows={3}
                          value={cmsData.about?.heritage?.p2 || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                heritage: { ...cmsData.about?.heritage, p2: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Paragraph 3: Modern Freight Mission</label>
                        <textarea
                          rows={3}
                          value={cmsData.about?.heritage?.p3 || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                heritage: { ...cmsData.about?.heritage, p3: e.target.value },
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Leadership & Founder Profile */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">About Page &bull; Leadership</div>
                      <h3>Founder Profile &amp; Executive Perspective</h3>
                      <p>Customize the bio narrative, quote, and photo for Samuel Lowe.</p>
                    </div>

                    <div className="cms-form-grid">
                      <div className="cms-field">
                        <label>Executive Name</label>
                        <input
                          type="text"
                          value={cmsData.about?.leadership?.name || 'Samuel Lowe'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                leadership: { ...cmsData.about?.leadership, name: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Corporate Title / Role</label>
                        <input
                          type="text"
                          value={cmsData.about?.leadership?.role || 'Founder & Principal'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                leadership: { ...cmsData.about?.leadership, role: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Biography Narrative</label>
                        <textarea
                          rows={3}
                          value={cmsData.about?.leadership?.bio || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                leadership: { ...cmsData.about?.leadership, bio: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Executive Leadership Quote</label>
                        <textarea
                          rows={2}
                          value={cmsData.about?.leadership?.quote || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                leadership: { ...cmsData.about?.leadership, quote: e.target.value },
                              },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <ImageDropzone
                          label="Founder Photo / Badge Image (Drag & Drop or Click)"
                          category="leadership"
                          value={cmsData.about?.leadership?.image || '/images/branding/Angular CRC Railroad Badge Logo.png'}
                          onChange={(newUrl) =>
                            setCmsData({
                              ...cmsData,
                              about: {
                                ...cmsData.about,
                                leadership: { ...cmsData.about?.leadership, image: newUrl },
                              },
                            })
                          }
                          helperText="Founder portrait or brand badge. Auto-compressed to WebP."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-PANE 4: COMPANY VALUES STUDIO (6 PRINCIPLES)
                  ============================================================= */}
              {cmsSubTab === 'values' && (
                <div className="cms-subtab-pane">
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Company Values &bull; Six Core Principles</div>
                      <h3>Operating Principles &amp; Standards</h3>
                      <p>Customize the 6 foundational commitments shown on /company-values.</p>
                    </div>

                    <div className="card-editor-grid">
                      {(cmsData.companyValues?.values || []).map((val, vIdx) => (
                        <div key={val.id || vIdx} className="card-editor-item">
                          <div className="card-editor-header">
                            <span className="card-editor-badge">Principle 0{vIdx + 1}</span>
                            <strong className="card-editor-title">{val.title}</strong>
                          </div>

                          <div className="cms-form-grid single-col">
                            <div className="cms-field">
                              <label>Value Name</label>
                              <input
                                type="text"
                                value={val.title}
                                onChange={(e) => {
                                  const updated = [...(cmsData.companyValues?.values || [])];
                                  updated[vIdx] = { ...updated[vIdx], title: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    companyValues: { ...cmsData.companyValues, values: updated },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Operational Description</label>
                              <textarea
                                rows={3}
                                value={val.text}
                                onChange={(e) => {
                                  const updated = [...(cmsData.companyValues?.values || [])];
                                  updated[vIdx] = { ...updated[vIdx], text: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    companyValues: { ...cmsData.companyValues, values: updated },
                                  });
                                }}
                              />
                            </div>

                            <div className="cms-field">
                              <label>Stat Line / Verification Note</label>
                              <input
                                type="text"
                                value={val.statLine || ''}
                                onChange={(e) => {
                                  const updated = [...(cmsData.companyValues?.values || [])];
                                  updated[vIdx] = { ...updated[vIdx], statLine: e.target.value };
                                  setCmsData({
                                    ...cmsData,
                                    companyValues: { ...cmsData.companyValues, values: updated },
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-PANE 5: CONTACT INFORMATION & RIBBON
                  ============================================================= */}
              {cmsSubTab === 'contact' && (
                <div className="cms-subtab-pane">
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Corporate Info &bull; Contact Details</div>
                      <h3>Official Contact &amp; Office Information</h3>
                      <p>Synced dynamically to header, footer, contact page, and carrier forms.</p>
                    </div>

                    <div className="cms-form-grid">
                      <div className="cms-field">
                        <label>Corporate Legal Name</label>
                        <input
                          type="text"
                          value={cmsData.companyInfo.name || 'Coast Road Capital'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              companyInfo: { ...cmsData.companyInfo, name: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Main Corporate Phone</label>
                        <input
                          type="text"
                          value={cmsData.companyInfo.phone}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              companyInfo: { ...cmsData.companyInfo, phone: e.target.value },
                            })
                          }
                        />
                        <span className="field-hint">e.g. 919-670-7979</span>
                      </div>

                      <div className="cms-field">
                        <label>24/7 Priority Emergency Dispatch Phone</label>
                        <input
                          type="text"
                          value={cmsData.companyInfo.emergencyPhone || '415-890-6644'}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              companyInfo: { ...cmsData.companyInfo, emergencyPhone: e.target.value },
                            })
                          }
                        />
                        <span className="field-hint">e.g. (415) 890-6644 (Shown on top ribbon &amp; book call)</span>
                      </div>

                      <div className="cms-field">
                        <label>Inquiries Email</label>
                        <input
                          type="email"
                          value={cmsData.companyInfo.email}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              companyInfo: { ...cmsData.companyInfo, email: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field full-width">
                        <label>Physical Office Address</label>
                        <input
                          type="text"
                          value={cmsData.companyInfo.address}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              companyInfo: { ...cmsData.companyInfo, address: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Business Operating Hours</label>
                        <input
                          type="text"
                          value={cmsData.companyInfo.hours}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              companyInfo: { ...cmsData.companyInfo, hours: e.target.value },
                            })
                          }
                        />
                      </div>

                      <div className="cms-field">
                        <label>Google Maps Direction URL</label>
                        <input
                          type="text"
                          value={cmsData.companyInfo.googleMapsUrl}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              companyInfo: { ...cmsData.companyInfo, googleMapsUrl: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Top Announcement Ribbon */}
                  <div className="cms-card">
                    <div className="cms-card-header">
                      <div className="cms-card-tag">Website Header &bull; Banner</div>
                      <h3>Top Announcement Ribbon Bar</h3>
                      <p>Enable/disable the global ribbon at the very top of the public website.</p>
                    </div>

                    <div className="announcement-config-box">
                      <div className="announcement-toggle-row">
                        <strong>Global Announcement Ribbon</strong>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={cmsData.announcement?.active ?? true}
                            onChange={(e) =>
                              setCmsData({
                                ...cmsData,
                                announcement: { ...cmsData.announcement, active: e.target.checked },
                              })
                            }
                          />
                          <span>Visible on public site</span>
                        </label>
                      </div>

                      <div className="announcement-inputs">
                        <input
                          type="text"
                          placeholder="Announcement message..."
                          value={cmsData.announcement?.text || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              announcement: { ...cmsData.announcement, text: e.target.value },
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Link path (e.g. /quote)"
                          value={cmsData.announcement?.link || ''}
                          onChange={(e) =>
                            setCmsData({
                              ...cmsData,
                              announcement: { ...cmsData.announcement, link: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* =============================================================
                  SUB-PANE 6: FAQS MANAGER
                  ============================================================= */}
              {cmsSubTab === 'faqs' && (
                <div className="cms-subtab-pane">
                  <div className="cms-card">
                    <div className="cms-card-header flex-between">
                      <div>
                        <div className="cms-card-tag">FAQ Studio &bull; Knowledge Base</div>
                        <h3>Frequently Asked Questions (FAQ) Manager</h3>
                        <p>Add, edit, or remove questions shown to prospective shippers on the FAQ and About pages.</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowAddFaq(true)}
                        className="btn-add-faq"
                      >
                        <Plus size={14} />
                        <span>Add New Question</span>
                      </button>
                    </div>

                    {/* Add FAQ Form Modal */}
                    {showAddFaq && (
                      <div className="add-faq-box">
                        <h4>New FAQ Entry</h4>
                        <input
                          type="text"
                          placeholder="Question title (e.g. What are typical lease term lengths?)..."
                          value={newFaqQ}
                          onChange={(e) => setNewFaqQ(e.target.value)}
                          className="faq-q-input"
                        />
                        <textarea
                          rows={3}
                          placeholder="Comprehensive answer explanation..."
                          value={newFaqA}
                          onChange={(e) => setNewFaqA(e.target.value)}
                          className="faq-a-input"
                        />
                        <div className="faq-action-row">
                          <button type="button" onClick={handleAddFaq} className="btn-save-faq">
                            Add Question
                          </button>
                          <button type="button" onClick={() => setShowAddFaq(false)} className="btn-cancel-faq">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="faq-admin-list">
                      {(cmsData.faqs || []).map((faq, fIdx) => (
                        <div key={faq.id || fIdx} className="faq-admin-item">
                          <div className="faq-item-top">
                            <input
                              type="text"
                              value={faq.q}
                              onChange={(e) => {
                                const updated = [...(cmsData.faqs || [])];
                                updated[fIdx] = { ...updated[fIdx], q: e.target.value };
                                setCmsData({ ...cmsData, faqs: updated });
                              }}
                              className="faq-q-editable"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteFaq(faq.id)}
                              className="btn-delete-faq"
                              title="Delete this question"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <textarea
                            rows={3}
                            value={faq.a}
                            onChange={(e) => {
                              const updated = [...(cmsData.faqs || [])];
                              updated[fIdx] = { ...updated[fIdx], a: e.target.value };
                              setCmsData({ ...cmsData, faqs: updated });
                            }}
                            className="faq-a-editable"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 5: MEDIA ASSET LIBRARY
              ================================================================= */}
          {activeTab === 'media' && cmsData && (
            <div className="tab-container">
              {/* Direct Drag & Drop Auto-Compress Uploader */}
              <div className="cms-card" style={{ background: 'linear-gradient(135deg, #171715 0%, #1F1F1D 100%)', border: '1px solid #333330' }}>
                <div className="cms-card-header">
                  <div className="cms-card-tag" style={{ background: '#AA2E1F', color: '#FFFFFF' }}>Instant Drag &amp; Drop</div>
                  <h3>Upload &amp; Auto-Compress Media Asset</h3>
                  <p>Drop any high-resolution JPG/PNG/WebP image here. The backend automatically compresses it to high-performance WebP and registers it in your library.</p>
                </div>
                <ImageDropzone
                  onChange={async () => {
                    const fresh = await fetchCmsContentApi();
                    if (fresh) setCmsData(fresh);
                    refreshCms();
                  }}
                  helperText="Drop an image here to upload and compress directly to WebP. No manual path typing required."
                />
              </div>

              {/* Register Media Asset Form */}
              <div className="cms-card">
                <div className="cms-card-header">
                  <h3>Manual Asset Registration</h3>
                  <p>Or manually register existing image file paths to make them easily accessible and copyable for website pages.</p>
                </div>

                <form onSubmit={handleAddMedia} className="media-register-form">
                  <div className="cms-field" style={{ flex: 1, minWidth: '220px' }}>
                    <label>Asset Title</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Modern Centerbeam Flatcar"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                    />
                  </div>

                  <div className="cms-field" style={{ flex: 1, minWidth: '240px' }}>
                    <label>Relative URL or Image Path</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. /images/equipment/category-boxcars.webp"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                    />
                  </div>

                  <div className="cms-field" style={{ minWidth: '160px' }}>
                    <label>Category</label>
                    <select
                      value={newMediaCat}
                      onChange={(e) => setNewMediaCat(e.target.value)}
                    >
                      <option value="equipment">Railcar Equipment</option>
                      <option value="branding">Brand &amp; Logos</option>
                      <option value="services">Services &amp; Track</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-register-media">
                    <Plus size={15} />
                    <span>Register Asset</span>
                  </button>
                </form>

                {mediaAddSuccess && (
                  <div className="admin-alert-banner success" style={{ marginTop: '1rem' }}>
                    <CheckCircle2 size={16} />
                    <span>Asset registered successfully!</span>
                  </div>
                )}
              </div>

              {/* Media Visual Grid */}
              <div className="media-grid">
                {(cmsData.media || []).map((m) => (
                  <div key={m.id} className="media-card">
                    <div className="media-thumb-wrap">
                      <img
                        src={m.url}
                        alt={m.title}
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="media-card-body">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="media-cat-tag">{m.category || 'Asset'}</span>
                        {m.url.startsWith('/uploads/') && (
                          <span style={{ fontSize: '0.62rem', background: '#AA2E1F', color: '#FFF', padding: '0.1rem 0.35rem', borderRadius: '3px', fontWeight: 700 }}>
                            WEBP
                          </span>
                        )}
                      </div>
                      <strong className="media-title">{m.title}</strong>
                      <code className="media-path">{m.url}</code>

                      <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.6rem' }}>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(m.url)}
                          className={`btn-copy-path ${copiedUrl === m.url ? 'copied' : ''}`}
                          style={{ flex: 1 }}
                        >
                          {copiedUrl === m.url ? <Check size={13} /> : <Copy size={13} />}
                          <span>{copiedUrl === m.url ? 'Copied!' : 'Copy Path'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteMedia(m.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.25)',
                            color: '#EF4444',
                            borderRadius: '6px',
                            padding: '0 0.6rem',
                            cursor: 'pointer',
                          }}
                          title="Delete asset from library"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 6: EXECUTIVE OVERVIEW & METRICS
              ================================================================= */}
          {activeTab === 'overview' && (
            <div className="tab-container">
              {/* 4 Metric Cards */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Quote Requests</span>
                    <FileText size={18} className="kpi-icon red" />
                  </div>
                  <div className="kpi-number">{stats?.summary.totalInquiries ?? inquiries.length}</div>
                  <div className="kpi-sub">
                    <span className="kpi-badge red">{stats?.summary.newInquiries ?? 1} New</span>
                    <span>{stats?.summary.reviewingInquiries ?? 1} in review</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Consultations</span>
                    <Calendar size={18} className="kpi-icon amber" />
                  </div>
                  <div className="kpi-number">{stats?.summary.totalBookings ?? bookings.length}</div>
                  <div className="kpi-sub">
                    <span className="kpi-badge amber">{stats?.summary.pendingBookings ?? 1} Pending</span>
                    <span>Scheduled shipper reviews</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Estimator Runs</span>
                    <Calculator size={18} className="kpi-icon green" />
                  </div>
                  <div className="kpi-number">{stats?.summary.totalEstimates ?? estimates.length}</div>
                  <div className="kpi-sub">
                    <span className="kpi-badge green">{stats?.summary.totalEstimatedCars ?? 55} Total Cars</span>
                    <span>Indicative pricing runs</span>
                  </div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <span className="kpi-label">Data Persistence</span>
                    <Layers size={18} className="kpi-icon slate" />
                  </div>
                  <div className="kpi-number status-ok">
                    {stats?.databaseConnected ? 'MongoDB Online' : 'Memory Resilient'}
                  </div>
                  <div className="kpi-sub">
                    <span>All inquiries and CMS edits persist seamlessly</span>
                  </div>
                </div>
              </div>

              {/* 2-Column Split: Equipment Demand + Activity Log */}
              <div className="overview-split-grid">
                <div className="cms-card">
                  <div className="cms-card-header">
                    <h3>Equipment Class Sourcing Demand</h3>
                    <p>Breakdown of equipment requests submitted by commercial shippers.</p>
                  </div>
                  <div className="demand-bars-list">
                    {[
                      { name: 'Boxcars', count: stats?.categoryDemand?.['Boxcars'] ?? 1, pct: 33 },
                      { name: 'Open-Top Hoppers', count: stats?.categoryDemand?.['Open-Top Hoppers'] ?? 1, pct: 33 },
                      { name: 'Tank Cars', count: stats?.categoryDemand?.['Tank Cars'] ?? 1, pct: 34 },
                      { name: 'Covered Hoppers', count: stats?.categoryDemand?.['Covered Hoppers'] ?? 0, pct: 0 },
                      { name: 'Centerbeams', count: stats?.categoryDemand?.['Centerbeams'] ?? 0, pct: 0 },
                    ].map((cat, i) => (
                      <div key={i} className="demand-bar-item">
                        <div className="demand-info">
                          <span>{cat.name}</span>
                          <strong>{cat.count} requests</strong>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill"
                            style={{
                              width: `${Math.max(8, cat.pct)}%`,
                              backgroundColor: i === 0 ? '#AA2E1F' : '#334155',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cms-card">
                  <div className="cms-card-header">
                    <h3>Recent Commercial Inbound Activity</h3>
                    <p>Latest inquiries and scheduled consultation calls.</p>
                  </div>
                  <div className="activity-list">
                    {(stats?.recentActivity || []).length === 0 ? (
                      <p className="no-activity">No recent activity logged yet.</p>
                    ) : (
                      (stats?.recentActivity || []).map((act, idx) => (
                        <div key={idx} className="activity-item">
                          <div className={`activity-icon-wrap ${act.type}`}>
                            {act.type === 'inquiry' ? <FileText size={15} /> : <Calendar size={15} />}
                          </div>
                          <div className="activity-details">
                            <strong>{act.title}</strong>
                            <span>{act.subtitle}</span>
                          </div>
                          <div className="activity-meta">
                            <span className={`status-pill-small ${act.status}`}>{act.status}</span>
                            <span className="activity-time">{new Date(act.time).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* =====================================================================
          MODERN ADMIN STYLING
          ===================================================================== */}
      <style>{`
        /* Base Admin Layout */
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background-color: #F8FAFC;
          font-family: var(--font-body, system-ui, sans-serif);
          color: #0F172A;
        }

        /* Sidebar Styling */
        .admin-sidebar {
          width: 260px;
          background-color: #0A0A09;
          color: #EDE6D4;
          display: flex;
          flex-direction: column;
          border-right: 1px solid #1E293B;
          position: sticky;
          top: 0;
          height: 100vh;
          overflow-y: auto;
          flex-shrink: 0;
          z-index: 50;
          transition: transform 200ms ease;
        }

        .admin-sidebar-header {
          padding: 1.25rem 1.25rem 1rem 1.25rem;
          border-bottom: 1px solid #1E293B;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .admin-sidebar-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .admin-brand-badge {
          background-color: #AA2E1F;
          color: #FFFFFF;
          font-weight: 900;
          font-size: 0.95rem;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.05em;
        }

        .sidebar-brand-name {
          font-weight: 800;
          font-size: 0.95rem;
          color: #FFFFFF;
          line-height: 1.2;
        }

        .sidebar-brand-sub {
          font-size: 0.70rem;
          color: #94A3B8;
        }

        .mobile-close-btn {
          display: none;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .admin-nav-list {
          padding: 1rem 0.75rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .nav-group-label {
          font-size: 0.68rem;
          font-weight: 800;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.85rem 0.5rem 0.35rem 0.5rem;
        }

        .admin-nav-item {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.60rem 0.75rem;
          border-radius: 6px;
          font-size: 0.84rem;
          font-weight: 600;
          color: #94A3B8;
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          transition: all 140ms ease;
        }

        .admin-nav-item:hover {
          background-color: rgba(255, 255, 255, 0.06);
          color: #FFFFFF;
        }

        .admin-nav-item.active {
          background-color: #AA2E1F;
          color: #FFFFFF;
          font-weight: 700;
        }

        .nav-label {
          flex: 1;
        }

        .nav-badge-pill {
          font-size: 0.70rem;
          font-weight: 800;
          background-color: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          padding: 1px 6px;
          border-radius: 10px;
        }

        .nav-badge-pill.warning {
          background-color: #D97706;
          color: #FFFFFF;
        }

        .admin-sidebar-footer {
          padding: 1rem 1.25rem;
          border-top: 1px solid #1E293B;
          background-color: rgba(0, 0, 0, 0.3);
        }

        .admin-user-profile {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 0.85rem;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background-color: #AA2E1F;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info {
          overflow: hidden;
        }

        .user-name {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #FFFFFF;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          display: block;
          font-size: 0.70rem;
          color: #94A3B8;
        }

        .sidebar-action-row {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sidebar-link,
        .btn-sidebar-logout {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.4rem 0.5rem;
          border-radius: 4px;
          text-decoration: none;
          cursor: pointer;
          transition: all 140ms ease;
        }

        .btn-sidebar-link {
          background-color: rgba(255, 255, 255, 0.08);
          color: #CBD5E1;
          border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .btn-sidebar-link:hover {
          background-color: rgba(255, 255, 255, 0.16);
          color: #FFFFFF;
        }

        .btn-sidebar-logout {
          background-color: transparent;
          color: #F87171;
          border: 1px solid rgba(248, 113, 113, 0.25);
        }

        .btn-sidebar-logout:hover {
          background-color: rgba(248, 113, 113, 0.15);
        }

        /* Workspace Styling */
        .admin-workspace {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .workspace-header {
          background-color: #FFFFFF;
          border-bottom: 1px solid #E2E8F0;
          padding: 1.15rem 1.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .mobile-hamburger {
          display: none;
          background: none;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          padding: 0.4rem;
          cursor: pointer;
          color: #0A0A09;
        }

        .header-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0A0A09;
          margin: 0 0 2px 0;
        }

        .header-sub {
          font-size: 0.78rem;
          color: #64748B;
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }

        .btn-save-cms {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background-color: #AA2E1F;
          color: #FFFFFF;
          border: none;
          border-radius: 5px;
          padding: 0.55rem 1.15rem;
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(170, 46, 31, 0.25);
          transition: background-color 150ms ease;
        }

        .btn-save-cms:hover {
          background-color: #8C2417;
        }

        .btn-refresh,
        .btn-visit-site {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          background-color: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 5px;
          padding: 0.52rem 0.85rem;
          font-size: 0.80rem;
          font-weight: 600;
          color: #334155;
          text-decoration: none;
          cursor: pointer;
          transition: all 140ms ease;
        }

        .btn-refresh:hover,
        .btn-visit-site:hover {
          background-color: #FFFFFF;
          border-color: #94A3B8;
          color: #0A0A09;
        }

        .admin-alert-banner {
          margin: 1.25rem 1.75rem 0 1.75rem;
          padding: 0.85rem 1.15rem;
          border-radius: 6px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.86rem;
          font-weight: 600;
        }

        .admin-alert-banner.success {
          background-color: #ECFDF5;
          border: 1px solid #A7F3D0;
          color: #065F46;
        }

        .workspace-main {
          padding: 1.75rem;
          flex: 1;
        }

        .tab-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Filter bar */
        .inquiry-filter-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.85rem 1rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .search-input-wrap {
          position: relative;
          flex: 1;
          min-width: 250px;
          display: flex;
          align-items: center;
        }

        .search-input-wrap svg {
          position: absolute;
          left: 10px;
          color: #64748B;
        }

        .search-input-wrap input {
          width: 100%;
          padding: 0.50rem 2rem 0.50rem 2.1rem;
          font-size: 0.84rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          outline: none;
          box-sizing: border-box;
          transition: border-color 140ms ease;
        }

        .search-input-wrap input:focus {
          border-color: #AA2E1F;
        }

        .clear-search {
          position: absolute;
          right: 8px;
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .filter-pill-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .filter-pill {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          color: #475569;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.40rem 0.75rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 140ms ease;
        }

        .filter-pill:hover {
          background-color: #FFFFFF;
          border-color: #CBD5E1;
          color: #0A0A09;
        }

        .filter-pill.active {
          background-color: #AA2E1F;
          border-color: #AA2E1F;
          color: #FFFFFF;
        }

        .btn-export-csv {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          color: #334155;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.40rem 0.75rem;
          border-radius: 6px;
          text-decoration: none;
          transition: all 140ms ease;
          margin-left: 0.35rem;
        }

        .btn-export-csv:hover {
          border-color: #94A3B8;
          color: #0A0A09;
        }

        /* Table Card */
        .admin-card-table {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
        }

        .table-responsive {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.86rem;
          text-align: left;
        }

        .admin-table thead {
          background-color: #F8FAFC;
          border-bottom: 1px solid #E2E8F0;
        }

        .admin-table th {
          padding: 0.85rem 1.15rem;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #64748B;
          white-space: nowrap;
        }

        .admin-table tbody tr {
          border-bottom: 1px solid #F1F5F9;
          transition: background-color 140ms ease;
        }

        .admin-table tbody tr:hover {
          background-color: #F8FAFC;
        }

        .clickable-row {
          cursor: pointer;
        }

        .admin-table td {
          padding: 0.90rem 1.15rem;
          vertical-align: middle;
        }

        .table-company {
          font-weight: 700;
          color: #0A0A09;
          font-size: 0.90rem;
        }

        .table-bold {
          font-weight: 600;
          color: #1E293B;
        }

        .table-bold.highlight {
          color: #AA2E1F;
        }

        .table-sub {
          font-size: 0.76rem;
          color: #64748B;
          margin-top: 1px;
        }

        .car-count-badge {
          font-size: 0.75rem;
          font-weight: 700;
          background-color: #F1F5F9;
          color: #334155;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .table-timing {
          font-size: 0.80rem;
          color: #475569;
        }

        .table-date {
          font-size: 0.78rem;
          color: #64748B;
          white-space: nowrap;
        }

        .table-notes {
          font-size: 0.78rem;
          color: #64748B;
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .ref-code {
          font-family: monospace;
          font-size: 0.80rem;
          background-color: #F1F5F9;
          padding: 2px 6px;
          border-radius: 4px;
          color: #0A0A09;
        }

        .btn-view-row {
          background-color: #F8FAFC;
          border: 1px solid #CBD5E1;
          color: #334155;
          font-size: 0.76rem;
          font-weight: 600;
          padding: 0.35rem 0.65rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 140ms ease;
        }

        .btn-view-row:hover {
          background-color: #FFFFFF;
          border-color: #AA2E1F;
          color: #AA2E1F;
        }

        .btn-action-inline {
          display: inline-flex;
          gap: 0.4rem;
        }

        .btn-action-confirm {
          background-color: #059669;
          color: #FFFFFF;
          border: none;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-action-complete {
          background-color: #0F172A;
          color: #FFFFFF;
          border: none;
          font-size: 0.74rem;
          font-weight: 700;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
        }

        /* Status Badges */
        .status-badge {
          display: inline-block;
          font-size: 0.70rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .status-badge.new {
          background-color: #FEE2E2;
          color: #991B1B;
        }

        .status-badge.reviewing,
        .status-badge.pending {
          background-color: #FEF3C7;
          color: #92400E;
        }

        .status-badge.contacted,
        .status-badge.confirmed {
          background-color: #ECFDF5;
          color: #065F46;
        }

        .status-badge.closed,
        .status-badge.completed {
          background-color: #F1F5F9;
          color: #475569;
        }

        /* Empty State */
        .empty-state {
          padding: 3.5rem 1.5rem;
          text-align: center;
          color: #64748B;
        }

        .empty-state svg {
          color: #CBD5E1;
          margin-bottom: 0.75rem;
        }

        .empty-state h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #0A0A09;
          margin: 0 0 0.35rem 0;
        }

        .empty-state p {
          font-size: 0.85rem;
          margin: 0;
        }

        /* Modal & Drawer */
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(10, 10, 9, 0.65);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          z-index: 100;
        }

        .inquiry-drawer-card {
          background-color: #FFFFFF;
          border-radius: 12px;
          max-width: 650px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
        }

        .drawer-header {
          padding: 1.5rem 1.75rem;
          border-bottom: 1px solid #E2E8F0;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .drawer-tag {
          font-size: 0.70rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #AA2E1F;
          letter-spacing: 0.05em;
        }

        .drawer-header h3 {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0A0A09;
          margin: 0.25rem 0 0.5rem 0;
        }

        .drawer-contact-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .contact-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.76rem;
          color: #334155;
          text-decoration: none;
          font-weight: 600;
        }

        .contact-pill:hover {
          border-color: #AA2E1F;
          color: #AA2E1F;
        }

        .btn-close-drawer {
          background: none;
          border: none;
          color: #94A3B8;
          cursor: pointer;
        }

        .drawer-body {
          padding: 1.5rem 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .spec-matrix-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1rem;
        }

        .spec-box-label {
          font-size: 0.70rem;
          color: #64748B;
          display: block;
        }

        .spec-box-val {
          font-size: 0.90rem;
          color: #0A0A09;
          display: block;
          margin-top: 2px;
        }

        .spec-box-val.highlight {
          color: #AA2E1F;
        }

        .drawer-section {
          display: flex;
          flex-direction: column;
        }

        .drawer-label {
          font-size: 0.74rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #334155;
          letter-spacing: 0.04em;
          margin-bottom: 0.45rem;
        }

        .shipper-notes-box {
          background-color: #FAF9F7;
          border: 1px solid #EADBCC;
          border-radius: 6px;
          padding: 0.85rem;
          font-size: 0.86rem;
          color: #0A0A09;
          line-height: 1.6;
        }

        .status-button-group {
          display: flex;
          gap: 0.45rem;
        }

        .status-btn-opt {
          flex: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          padding: 0.50rem;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: capitalize;
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          cursor: pointer;
          transition: all 140ms ease;
        }

        .status-btn-opt.active {
          border-color: #AA2E1F;
          background-color: #FFF5F5;
          color: #AA2E1F;
        }

        .internal-note-input {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.84rem;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 0.5rem;
        }

        .btn-save-note {
          align-self: flex-start;
          background-color: #0F172A;
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          padding: 0.4rem 0.85rem;
          font-size: 0.78rem;
          font-weight: 600;
          cursor: pointer;
        }

        .drawer-footer {
          padding: 1.15rem 1.75rem;
          border-top: 1px solid #E2E8F0;
          background-color: #F8FAFC;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .btn-delete-record {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background: none;
          border: none;
          color: #DC2626;
          font-size: 0.80rem;
          font-weight: 600;
          cursor: pointer;
        }

        .btn-done {
          background-color: #AA2E1F;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 0.55rem 1.25rem;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
        }

        /* CMS Sub-Tabs & Form */
        .cms-subtab-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 0.5rem;
        }

        .cms-subtab-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.50rem 0.90rem;
          border-radius: 6px;
          border: none;
          background-color: transparent;
          font-size: 0.82rem;
          font-weight: 600;
          color: #64748B;
          cursor: pointer;
          transition: all 140ms ease;
        }

        .cms-subtab-pill:hover {
          background-color: #F8FAFC;
          color: #0A0A09;
        }

        .cms-subtab-pill.active {
          background-color: #0A0A09;
          color: #FFFFFF;
        }

        .cms-subtab-pane {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .cms-card-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #AA2E1F;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 0.35rem;
        }

        .full-width {
          grid-column: 1 / -1;
        }

        .card-editor-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.25rem;
        }

        .card-editor-item {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .card-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 0.65rem;
        }

        .card-editor-badge {
          font-size: 0.72rem;
          font-family: monospace;
          font-weight: 700;
          color: #64748B;
        }

        .card-editor-title {
          font-size: 0.88rem;
          color: #0A0A09;
        }

        .equipment-editor-card {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .eq-editor-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #E2E8F0;
          padding-bottom: 0.75rem;
        }

        .eq-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .eq-rate-tag {
          font-size: 0.82rem;
          font-weight: 800;
          color: #AA2E1F;
          background-color: #FDF2F0;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .image-input-with-preview {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .field-thumb-preview {
          width: 60px;
          height: 42px;
          object-fit: cover;
          border-radius: 4px;
          border: 1px solid #CBD5E1;
          background-color: #0A0A09;
          flex-shrink: 0;
        }

        .faq-q-editable {
          width: 100%;
          border: 1px solid #E2E8F0;
          padding: 0.40rem 0.55rem;
          border-radius: 4px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #0A0A09;
          background-color: #FAF8F5;
        }

        .faq-q-editable:focus {
          border-color: #AA2E1F;
          background: #FFFFFF;
          outline: none;
        }

        .faq-a-editable {
          width: 100%;
          border: 1px solid #E2E8F0;
          padding: 0.45rem 0.55rem;
          border-radius: 4px;
          font-size: 0.82rem;
          color: #334155;
          margin-top: 0.45rem;
          background-color: #FFFFFF;
          box-sizing: border-box;
        }

        .faq-a-editable:focus {
          border-color: #AA2E1F;
          outline: none;
        }

        .cms-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1.75rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .cms-card-header {
          margin-bottom: 1.5rem;
        }

        .cms-card-header.flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .cms-card-header h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0A0A09;
          margin: 0 0 0.25rem 0;
        }

        .cms-card-header p {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0;
        }

        .cms-form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
        }

        .cms-form-grid.single-col {
          grid-template-columns: 1fr;
        }

        .cms-field {
          display: flex;
          flex-direction: column;
        }

        .cms-field label {
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.35rem;
        }

        .cms-field input,
        .cms-field select,
        .cms-field textarea {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.86rem;
          outline: none;
          box-sizing: border-box;
          transition: border-color 140ms ease;
        }

        .cms-field input:focus,
        .cms-field select:focus,
        .cms-field textarea:focus {
          border-color: #AA2E1F;
        }

        .field-hint {
          font-size: 0.72rem;
          color: #64748B;
          margin-top: 0.25rem;
        }

        .announcement-config-box {
          background-color: #FAF9F7;
          border: 1px solid #EADBCC;
          border-radius: 8px;
          padding: 1.15rem;
          margin-bottom: 1.5rem;
        }

        .announcement-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .toggle-switch {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-size: 0.80rem;
          font-weight: 700;
          cursor: pointer;
        }

        .announcement-inputs {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 0.75rem;
        }

        .announcement-inputs input {
          padding: 0.50rem 0.75rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.84rem;
        }

        .spec-strip-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.75rem;
        }

        /* Equipment Overrides */
        .equipment-overrides-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .equipment-override-item {
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 1rem 1.25rem;
        }

        .eq-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }

        .eq-name {
          font-size: 0.95rem;
          color: #0A0A09;
        }

        .eq-badge {
          font-size: 0.70rem;
          font-family: monospace;
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .eq-inputs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        /* FAQ List */
        .btn-add-faq {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: #AA2E1F;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 0.45rem 0.85rem;
          font-size: 0.80rem;
          font-weight: 700;
          cursor: pointer;
        }

        .add-faq-box {
          background-color: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 8px;
          padding: 1.15rem;
          margin-bottom: 1.5rem;
        }

        .add-faq-box h4 {
          margin: 0 0 0.75rem 0;
          font-size: 0.92rem;
          color: #0A0A09;
        }

        .faq-q-input,
        .faq-a-input {
          width: 100%;
          padding: 0.50rem 0.75rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          font-size: 0.84rem;
          box-sizing: border-box;
          margin-bottom: 0.65rem;
        }

        .faq-action-row {
          display: flex;
          gap: 0.5rem;
        }

        .btn-save-faq {
          background-color: #AA2E1F;
          color: #FFFFFF;
          border: none;
          border-radius: 4px;
          padding: 0.45rem 0.85rem;
          font-size: 0.80rem;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-cancel-faq {
          background: none;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          padding: 0.45rem 0.75rem;
          font-size: 0.80rem;
          cursor: pointer;
        }

        .faq-admin-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .faq-admin-item {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.85rem 1rem;
        }

        .faq-item-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.5rem;
        }

        .faq-q {
          font-size: 0.90rem;
          color: #0A0A09;
        }

        .btn-delete-faq {
          background: none;
          border: none;
          color: #DC2626;
          cursor: pointer;
          padding: 2px;
        }

        .faq-a {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0.35rem 0 0 0;
          line-height: 1.5;
        }

        /* Media Library */
        .media-register-form {
          display: flex;
          flex-wrap: wrap;
          gap: 0.85rem;
          align-items: flex-end;
        }

        .btn-register-media {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          background-color: #0F172A;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 0.55rem 1rem;
          font-size: 0.84rem;
          font-weight: 700;
          cursor: pointer;
          height: 36px;
        }

        .media-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 1.25rem;
        }

        .media-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .media-thumb-wrap {
          height: 140px;
          background-color: #0F172A;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .media-thumb-wrap img {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        .media-card-body {
          padding: 0.85rem;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .media-cat-tag {
          font-size: 0.68rem;
          font-weight: 800;
          color: #AA2E1F;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .media-title {
          font-size: 0.86rem;
          color: #0A0A09;
          margin: 2px 0 4px 0;
          line-height: 1.3;
        }

        .media-path {
          font-size: 0.70rem;
          color: #64748B;
          word-break: break-all;
          background-color: #F8FAFC;
          padding: 2px 4px;
          border-radius: 3px;
        }

        .btn-copy-path {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          margin-top: 0.75rem;
          width: 100%;
          background-color: #F8FAFC;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          padding: 0.35rem 0.5rem;
          font-size: 0.74rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
          transition: all 140ms ease;
        }

        .btn-copy-path:hover {
          background-color: #FFFFFF;
          border-color: #94A3B8;
          color: #0A0A09;
        }

        .btn-copy-path.copied {
          background-color: #ECFDF5;
          border-color: #059669;
          color: #059669;
        }

        /* KPI Dashboard Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 1.25rem;
        }

        .kpi-card {
          background-color: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 10px;
          padding: 1.25rem 1.35rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .kpi-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .kpi-label {
          font-size: 0.74rem;
          font-weight: 700;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .kpi-icon {
          padding: 6px;
          border-radius: 6px;
          box-sizing: content-box;
        }

        .kpi-icon.red {
          background-color: #FEE2E2;
          color: #AA2E1F;
        }

        .kpi-icon.amber {
          background-color: #FEF3C7;
          color: #D97706;
        }

        .kpi-icon.green {
          background-color: #ECFDF5;
          color: #059669;
        }

        .kpi-icon.slate {
          background-color: #F1F5F9;
          color: #475569;
        }

        .kpi-number {
          font-size: 1.85rem;
          font-weight: 800;
          color: #0A0A09;
          line-height: 1.2;
          margin-bottom: 0.5rem;
        }

        .kpi-number.status-ok {
          font-size: 1.15rem;
          color: #059669;
          margin-top: 0.25rem;
        }

        .kpi-sub {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.74rem;
          color: #64748B;
        }

        .kpi-badge {
          font-size: 0.68rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 4px;
        }

        .kpi-badge.red {
          background-color: #FEE2E2;
          color: #991B1B;
        }

        .kpi-badge.amber {
          background-color: #FEF3C7;
          color: #92400E;
        }

        .kpi-badge.green {
          background-color: #ECFDF5;
          color: #065F46;
        }

        .overview-split-grid {
          display: grid;
          grid-template-columns: minmax(300px, 380px) 1fr;
          gap: 1.5rem;
          align-items: start;
        }

        .demand-bars-list {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .demand-bar-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .demand-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.80rem;
          color: #334155;
        }

        .bar-track {
          height: 6px;
          background-color: #F1F5F9;
          border-radius: 3px;
          overflow: hidden;
        }

        .bar-fill {
          height: 100%;
          border-radius: 3px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 0.85rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
        }

        .activity-icon-wrap {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 0.75rem;
        }

        .activity-icon-wrap.inquiry {
          background-color: #FEE2E2;
          color: #AA2E1F;
        }

        .activity-icon-wrap.booking {
          background-color: #FEF3C7;
          color: #D97706;
        }

        .activity-details {
          flex: 1;
        }

        .activity-details strong {
          display: block;
          font-size: 0.85rem;
          color: #0A0A09;
        }

        .activity-details span {
          font-size: 0.74rem;
          color: #64748B;
        }

        .activity-meta {
          text-align: right;
        }

        .status-pill-small {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 1px 5px;
          border-radius: 3px;
        }

        .status-pill-small.new {
          background-color: #FEE2E2;
          color: #991B1B;
        }

        .status-pill-small.confirmed,
        .status-pill-small.contacted {
          background-color: #ECFDF5;
          color: #065F46;
        }

        .activity-time {
          display: block;
          font-size: 0.70rem;
          color: #94A3B8;
          margin-top: 1px;
        }

        .no-activity {
          font-size: 0.84rem;
          color: #64748B;
          margin: 0;
        }

        /* Login Screen */
        .admin-login-wrapper {
          min-height: 100vh;
          background-color: #0A0A09;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .admin-login-box {
          max-width: 420px;
          width: 100%;
          background-color: #FFFFFF;
          border-radius: 12px;
          padding: 2.5rem 2rem;
          border-top: 4px solid #AA2E1F;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 1.75rem;
        }

        .admin-login-header .admin-brand-badge {
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .admin-login-header h2 {
          font-size: 1.5rem;
          font-weight: 800;
          color: #0A0A09;
          margin: 0 0 0.25rem 0;
        }

        .admin-login-header p {
          font-size: 0.82rem;
          color: #64748B;
          margin: 0;
        }

        .admin-login-error {
          background-color: #FEF2F2;
          border: 1px solid #FCA5A5;
          color: #991B1B;
          padding: 0.65rem 0.85rem;
          border-radius: 6px;
          font-size: 0.82rem;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-bottom: 1.25rem;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.15rem;
        }

        .admin-form-group label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #334155;
          margin-bottom: 0.35rem;
        }

        .admin-form-group input {
          width: 100%;
          padding: 0.65rem 0.85rem;
          font-size: 0.90rem;
          border: 1px solid #CBD5E1;
          border-radius: 6px;
          box-sizing: border-box;
          outline: none;
        }

        .admin-form-group input:focus {
          border-color: #AA2E1F;
        }

        .admin-btn-login {
          background-color: #AA2E1F;
          color: #FFFFFF;
          border: none;
          border-radius: 6px;
          padding: 0.75rem;
          font-size: 0.92rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 150ms ease;
          margin-top: 0.35rem;
        }

        .admin-btn-login:hover {
          background-color: #8C2417;
        }

        .admin-demo-shortcut {
          margin-top: 0.75rem;
          background-color: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: 8px;
          padding: 0.85rem;
          font-size: 0.75rem;
          color: #64748B;
        }

        .demo-badge {
          font-weight: 800;
          color: #0A0A09;
          margin-bottom: 0.35rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .demo-creds {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          margin-bottom: 0.6rem;
        }

        .demo-creds code {
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          padding: 1px 4px;
          border-radius: 3px;
          color: #0A0A09;
        }

        .btn-fill-demo {
          width: 100%;
          background-color: #FFFFFF;
          border: 1px solid #CBD5E1;
          border-radius: 4px;
          padding: 0.35rem;
          font-size: 0.74rem;
          font-weight: 600;
          color: #334155;
          cursor: pointer;
        }

        .btn-fill-demo:hover {
          background-color: #F1F5F9;
          color: #0A0A09;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Mobile Responsive */
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            transform: translateX(-100%);
            box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
          }

          .admin-sidebar.mobile-open {
            transform: translateX(0);
          }

          .mobile-close-btn {
            display: block;
          }

          .mobile-hamburger {
            display: block;
          }

          .workspace-header {
            padding: 0.85rem 1rem;
          }

          .workspace-main {
            padding: 1rem;
          }

          .overview-split-grid {
            grid-template-columns: 1fr;
          }

          .desktop-only {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};
