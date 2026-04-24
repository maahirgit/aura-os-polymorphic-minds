import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Box, 
  Activity, 
  AlertCircle, 
  Settings, 
  Bell, 
  Search, 
  ChevronRight, 
  MoreHorizontal,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Info,
  Clock,
  X,
  Download,
  CheckCircle,
  Edit3,
  Save,
  PlusCircle,
  Trash2,
  Database,
  History,
  Zap,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

function App() {
  const [kiosks, setKiosks] = useState([]);
  const [config, setConfig] = useState({});
  const [logs, setLogs] = useState([]);
  const [selectedKiosk, setSelectedKiosk] = useState(null);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [kiosksRes, configRes, logsRes] = await Promise.all([
        axios.get(`${API_BASE}/kiosks`),
        axios.get(`${API_BASE}/config`),
        axios.get(`${API_BASE}/logs`)
      ]);
      setKiosks(kiosksRes.data);
      setConfig(configRes.data);
      setLogs(logsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Sync error:", err);
    }
  };

  const toggleEmergency = async () => {
    try {
      const newState = !config.emergencyMode;
      await axios.post(`${API_BASE}/toggle-emergency`, { enabled: newState });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deployNode = async (data) => {
    try {
      await axios.post(`${API_BASE}/kiosks`, data);
      setShowDeployModal(false);
      fetchData();
    } catch (err) {
      alert("Deployment failed: " + (err.response?.data?.error || err.message));
    }
  };

  const updateKiosk = async (id, data) => {
    try {
      await axios.patch(`${API_BASE}/kiosks/${id}`, data);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      alert("Update failed: " + (err.response?.data?.error || err.message));
    }
  };

  const createCheckpoint = async (id) => {
    try {
      await axios.post(`${API_BASE}/kiosks/${id}/checkpoint`);
      alert("Checkpoint created successfully!");
      fetchData();
    } catch (err) {
      alert("Checkpoint failed: " + err.message);
    }
  };

  const restoreCheckpoint = async (id) => {
    try {
      await axios.post(`${API_BASE}/kiosks/${id}/restore`);
      alert("Node restored to latest checkpoint!");
      fetchData();
    } catch (err) {
      alert("Restore failed: " + (err.response?.data?.error || err.message));
    }
  };

  const exportAuditHistory = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `aura_audit_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handlePurchase = async (kioskId, itemId, quantity = 1) => {
    try {
      await axios.post(`${API_BASE}/purchase`, { kioskId, itemId, quantity });
      fetchData();
    } catch (err) {
      fetchData();
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center font-semibold text-indigo-600">Loading Management Console...</div>;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <ShieldCheck size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aura Retail OS</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20}/>} label="Dashboard" />
          <NavItem active={activeTab === 'nodes'} onClick={() => setActiveTab('nodes')} icon={<Box size={20}/>} label="Retail Nodes" />
          <NavItem active={activeTab === 'logs'} onClick={() => setActiveTab('logs')} icon={<Activity size={20}/>} label="System Logs" />
          <NavItem active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings size={20}/>} label="Configuration" />
        </nav>

        <div className={`p-4 rounded-xl border ${config.emergencyMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
          <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current State</p>
          <div className="flex items-center justify-between">
            <span className={`text-sm font-bold ${config.emergencyMode ? 'text-amber-500' : 'text-indigo-400'}`}>
              {config.emergencyMode ? 'EMERGENCY' : 'STANDARD'}
            </span>
            <button onClick={toggleEmergency} className="text-[10px] bg-white/10 px-2 py-1 rounded hover:bg-white/20 transition-all">
              SWITCH
            </button>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-lg w-96">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search kiosks or locations..." className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer" onClick={() => setActiveTab('logs')}>
              <Bell size={20} className="text-slate-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto main-content pb-12 custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h2 className="text-2xl font-extrabold">Network Overview</h2>
                  <p className="text-slate-500 text-sm">Real-time status of your autonomous retail infrastructure.</p>
                </div>
                <button onClick={() => setShowDeployModal(true)} className="btn-primary flex items-center gap-2">
                  <Plus size={18} /> Deploy New Node
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Total Nodes" value={kiosks.length} />
                <StatCard label="Operational Health" value="98.2%" color="text-emerald-600" />
                <StatCard label="Active Users" value="1,248" />
                <StatCard label="Daily Revenue" value={`₹14,204`} />
              </div>

              <div className="grid grid-cols-12 gap-8">
                {/* Node List */}
                <div className="col-span-12 lg:col-span-8 card">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Active Retail Nodes</h3>
                    <button onClick={() => setActiveTab('nodes')} className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                          <th className="pb-4">Node ID</th>
                          <th className="pb-4">Location</th>
                          <th className="pb-4">State</th>
                          <th className="pb-4">Telemetry</th>
                          <th className="pb-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {kiosks.map(kiosk => (
                          <tr 
                            key={kiosk.id} 
                            onClick={() => setSelectedKiosk(kiosk)}
                            className="table-row group cursor-pointer"
                          >
                            <td className="py-4 font-semibold text-slate-800">{kiosk.id}</td>
                            <td className="py-4 text-slate-500 text-sm">{kiosk.location}</td>
                            <td className="py-4">
                              <span className={`status-badge ${
                                kiosk.state === 'ActiveState' ? 'badge-online' : 
                                kiosk.state === 'EmergencyLockdownState' ? 'badge-emergency' : 'badge-maintenance'
                              }`}>
                                {kiosk.state.replace('State', '')}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <div className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                  {kiosk.telemetry.temp.toFixed(1)}°C
                                </div>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-emerald-500" style={{width: `${kiosk.health}%`}}></div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 text-right">
                              <div className="p-2 hover:bg-slate-200 rounded-lg transition-all inline-block">
                                <ChevronRight size={18} className="text-slate-400" />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Side Panel: Recent Logs */}
                <div className="col-span-12 lg:col-span-4 card flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Event Audit Log</h3>
                    <div className="bg-slate-100 p-1.5 rounded-lg">
                      <Clock size={16} className="text-slate-400" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    {logs.slice(0, 10).map(log => (
                      <div key={log.id} className="log-entry">
                        <span className="text-slate-400">[{log.time}]</span>{' '}
                        <span className={`font-bold ${
                          log.type === 'ERROR' ? 'text-red-500' :
                          log.type === 'WARN' ? 'text-amber-500' :
                          log.type === 'SUCCESS' ? 'text-emerald-500' : 'text-indigo-600'
                        }`}>{log.type}</span>: {log.message}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={exportAuditHistory}
                    className="mt-6 w-full py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={16} /> Export Audit History
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nodes' && (
            <div className="space-y-8">
              <h2 className="text-2xl font-extrabold">All Retail Nodes</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kiosks.map(kiosk => (
                  <div key={kiosk.id} className="card hover:border-indigo-300 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                        <Box size={24} />
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => { setSelectedKiosk(kiosk); setIsEditing(true); }} className="text-slate-300 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-all">
                          <Edit3 size={18} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-lg">{kiosk.id}</h4>
                    <p className="text-slate-500 text-sm mb-4">{kiosk.location}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Temp</p>
                        <p className="text-sm font-bold">{kiosk.telemetry.temp.toFixed(1)}°C</p>
                      </div>
                      <div className="p-2 bg-slate-50 rounded-lg">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Power</p>
                        <p className="text-sm font-bold">{kiosk.telemetry.power.toFixed(1)}kW</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                        <button 
                        onClick={() => setSelectedKiosk(kiosk)}
                        className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all"
                        >
                        Inventory
                        </button>
                        <button 
                        onClick={() => createCheckpoint(kiosk.id)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all"
                        title="Create Checkpoint (Memento)"
                        >
                        <Database size={18} />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-extrabold">System History</h2>
                <button onClick={exportAuditHistory} className="btn-primary flex items-center gap-2">
                  <Download size={18} /> Download All Logs
                </button>
              </div>
              <div className="card space-y-2 font-mono text-sm overflow-x-auto">
                {logs.map(log => (
                  <div key={log.id} className="flex gap-4 py-2 border-b border-slate-50">
                    <span className="text-slate-400 shrink-0">{log.time}</span>
                    <span className={`font-bold shrink-0 w-20 ${
                      log.type === 'ERROR' ? 'text-red-500' :
                      log.type === 'WARN' ? 'text-amber-500' :
                      log.type === 'SUCCESS' ? 'text-emerald-500' : 'text-indigo-600'
                    }`}>{log.type}</span>
                    <span className="text-slate-700">{log.message}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Deploy Modal */}
      <AnimatePresence>
        {showDeployModal && (
          <DeployModal onClose={() => setShowDeployModal(false)} onDeploy={deployNode} />
        )}
      </AnimatePresence>

      {/* Modern Modal (Inventory or Edit) */}
      <AnimatePresence>
        {selectedKiosk && (
          <Modal 
            kiosk={selectedKiosk} 
            isEditing={isEditing}
            onClose={() => { setSelectedKiosk(null); setIsEditing(false); }}
            onPurchase={handlePurchase}
            onSave={updateKiosk}
            onRestore={() => restoreCheckpoint(selectedKiosk.id)}
            emergencyMode={config.emergencyMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${
        active ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
}

function StatCard({ label, value, color = "text-slate-900" }) {
  return (
    <div className="card stat-card">
      <span className="stat-label">{label}</span>
      <span className={`stat-value ${color}`}>{value}</span>
    </div>
  );
}

function DeployModal({ onClose, onDeploy }) {
  const [formData, setFormData] = useState({ id: '', type: 'PHARMACY', location: '' });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-extrabold">Deploy New Node</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Node ID</label>
            <input 
              type="text" 
              placeholder="e.g. K-404"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
              value={formData.id}
              onChange={e => setFormData({...formData, id: e.target.value})}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Kiosk Type</label>
            <select 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value})}
            >
              <option value="PHARMACY">PHARMACY</option>
              <option value="FOOD">FOOD</option>
              <option value="EMERGENCY">EMERGENCY</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Location</label>
            <input 
              type="text" 
              placeholder="e.g. Zephyrus Park"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          
          <button 
            onClick={() => onDeploy(formData)}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold mt-4 shadow-lg hover:bg-indigo-700 transition-all"
          >
            Start Deployment
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Modal({ kiosk, isEditing, onClose, onPurchase, onSave, onRestore, emergencyMode }) {
  const [buyingItem, setBuyingItem] = useState(null);
  const [editData, setEditData] = useState({ 
    location: kiosk.location, 
    inventory: JSON.parse(JSON.stringify(kiosk.inventory)),
    addons: []
  });

  const handleAddItem = () => {
    const newItemId = `item-${Date.now()}`;
    setEditData({
      ...editData,
      inventory: {
        ...editData.inventory,
        [newItemId]: { id: newItemId, name: 'New Item', count: 0, price: 0, isEssential: false }
      }
    });
  };

  const updateItem = (id, field, value) => {
    setEditData({
      ...editData,
      inventory: {
        ...editData.inventory,
        [id]: { ...editData.inventory[id], [field]: value }
      }
    });
  };

  const deleteItem = (id) => {
    const newInv = { ...editData.inventory };
    delete newInv[id];
    setEditData({ ...editData, inventory: newInv });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-xl font-extrabold flex items-center gap-3">
              {isEditing ? `Manage Node: ${kiosk.id}` : `Retail Node: ${kiosk.id}`}
            </h2>
            <p className="text-xs text-slate-500 font-medium">{kiosk.location} • Type: {kiosk.type}</p>
          </div>
          <div className="flex items-center gap-3">
            {isEditing && (
              <button onClick={() => onSave(kiosk.id, editData)} className="btn-primary flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700">
                <Save size={18}/> Save Changes
              </button>
            )}
            {!isEditing && (
                <button onClick={onRestore} className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-all" title="Restore Memento">
                    <History size={20} />
                </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-all">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-12 gap-8 custom-scrollbar">
          <div className="col-span-12 md:col-span-7 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                {isEditing ? 'Configuration & Inventory' : 'Product Inventory'}
              </h3>
              {!isEditing && (
                <div className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-bold uppercase">
                  {kiosk.state}
                </div>
              )}
              {isEditing && (
                <button onClick={handleAddItem} className="text-indigo-600 text-xs font-bold flex items-center gap-1 hover:underline">
                  <PlusCircle size={14}/> Add New Item
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {Object.values(isEditing ? editData.inventory : kiosk.inventory).map(item => (
                <div 
                  key={item.id} 
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-4 ${
                    buyingItem?.id === item.id && !isEditing ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 bg-slate-50/50'
                  }`}
                  onClick={() => !isEditing && setBuyingItem(item)}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                        <ShoppingBag size={20} className="text-indigo-600" />
                      </div>
                      {isEditing ? (
                        <input 
                          value={item.name} 
                          onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                          className="font-bold text-slate-800 bg-transparent border-b border-indigo-200 focus:border-indigo-600 outline-none w-full"
                        />
                      ) : (
                        <div>
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-xs text-slate-400 font-medium">Stock: {item.count} units available</p>
                        </div>
                      )}
                    </div>
                    {!isEditing && (
                      <div className="text-right">
                        <p className="text-lg font-extrabold text-slate-900">₹{item.price.toFixed(2)}</p>
                        {item.isEssential && <span className="text-[8px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-bold uppercase">Essential</span>}
                      </div>
                    )}
                    {isEditing && (
                      <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 p-2">
                        <Trash2 size={18}/>
                      </button>
                    )}
                  </div>

                  {isEditing && (
                    <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Price (₹)</label>
                        <input 
                          type="number"
                          value={item.price} 
                          onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value))}
                          className="w-full text-xs font-bold p-1 bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Stock</label>
                        <input 
                          type="number"
                          value={item.count} 
                          onChange={(e) => updateItem(item.id, 'count', parseInt(e.target.value))}
                          className="w-full text-xs font-bold p-1 bg-white border border-slate-200 rounded"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-4">
                        <input 
                          type="checkbox"
                          checked={item.isEssential} 
                          onChange={(e) => updateItem(item.id, 'isEssential', e.target.checked)}
                          id={`ess-${item.id}`}
                        />
                        <label htmlFor={`ess-${item.id}`} className="text-[9px] font-bold text-slate-400 uppercase">Essential</label>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-12 md:col-span-5">
            <div className="bg-slate-50 rounded-3xl p-6 h-full border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
                {isEditing ? 'Secure Node Access (Proxy)' : 'Transaction Detail'}
              </h3>
              
              {isEditing ? (
                <div className="space-y-6">
                   <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Current Location</label>
                    <input 
                      type="text" 
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                      value={editData.location}
                      onChange={e => setEditData({...editData, location: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Hardware Addons (Decorator)</label>
                    <div className="space-y-2">
                        <AddonOption 
                            label="Solar Power Backup" 
                            active={editData.addons.includes('SOLAR')}
                            onClick={() => setEditData({
                                ...editData, 
                                addons: editData.addons.includes('SOLAR') ? editData.addons.filter(a => a !== 'SOLAR') : [...editData.addons, 'SOLAR']
                            })}
                        />
                        <AddonOption 
                            label="Advanced Cooling System" 
                            active={editData.addons.includes('COOLING')}
                            onClick={() => setEditData({
                                ...editData, 
                                addons: editData.addons.includes('COOLING') ? editData.addons.filter(a => a !== 'COOLING') : [...editData.addons, 'COOLING']
                            })}
                        />
                    </div>
                  </div>

                  <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p className="text-[10px] text-indigo-600 font-bold uppercase mb-2 flex items-center gap-1">
                        <ShieldAlert size={10}/> Security Level: High (Proxy Active)
                    </p>
                    <div className="space-y-2 text-xs font-medium text-slate-600">
                      <div className="flex justify-between"><span>Node ID:</span><span>{kiosk.id}</span></div>
                      <div className="flex justify-between"><span>Hardware Profile:</span><span>{kiosk.type}</span></div>
                      <div className="flex justify-between"><span>Active Modules:</span><span>{kiosk.modules.length}</span></div>
                    </div>
                  </div>
                </div>
              ) : buyingItem ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Unit Price</span>
                      <span className="font-bold">₹{buyingItem.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Pricing Policy</span>
                      <span className={`font-bold ${emergencyMode && buyingItem.isEssential ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {emergencyMode && buyingItem.isEssential ? 'Emergency (-50%)' : 'Standard'}
                      </span>
                    </div>
                    <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-end">
                      <span className="text-sm font-bold text-slate-800">Total Price</span>
                      <span className="text-3xl font-extrabold text-indigo-600">
                        ₹{(emergencyMode && buyingItem.isEssential ? buyingItem.price * 0.5 : buyingItem.price).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/60 p-4 rounded-2xl border border-white text-[10px] text-slate-500 leading-relaxed italic">
                    <Info size={12} className="inline mr-1 mb-0.5" />
                    Transaction will be processed via an atomic command. If hardware fails during dispensing, an automatic rollback will occur.
                  </div>

                  <button 
                    onClick={() => {
                      onPurchase(kiosk.id, buyingItem.id);
                      setBuyingItem(null);
                    }}
                    disabled={buyingItem.count <= 0 || (emergencyMode && !buyingItem.isEssential)}
                    className={`w-full py-4 rounded-2xl font-bold text-sm shadow-lg transition-all ${
                      (emergencyMode && !buyingItem.isEssential) ? 'bg-red-100 text-red-600 cursor-not-allowed shadow-none' :
                      buyingItem.count > 0 ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200' :
                      'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    {emergencyMode && !buyingItem.isEssential ? "Distribution Restricted" : "Complete Purchase"}
                  </button>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20">
                  <div className="grid grid-cols-2 gap-6 w-full px-8">
                     <TelemetryMini icon={<Thermometer size={14}/>} label="Temp" value={`${kiosk.telemetry.temp.toFixed(1)}°C`} />
                     <TelemetryMini icon={<Zap size={14}/>} label="Power" value={`${kiosk.telemetry.power.toFixed(1)}kW`} />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-center mt-8 opacity-30">Node Telemetry Active</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AddonOption({ label, active, onClick }) {
    return (
        <div 
            onClick={onClick}
            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${
                active ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-500'
            }`}
        >
            <span className="text-xs font-bold">{label}</span>
            {active ? <CheckCircle size={16}/> : <div className="w-4 h-4 rounded-full border-2 border-slate-200"></div>}
        </div>
    );
}

function TelemetryMini({ icon, label, value }) {
    return (
        <div className="p-3 bg-white border border-slate-100 rounded-2xl flex flex-col gap-1 items-center">
            <div className="text-indigo-600 mb-1">{icon}</div>
            <span className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">{label}</span>
            <span className="text-xs font-extrabold text-slate-800">{value}</span>
        </div>
    );
}

export default App;
