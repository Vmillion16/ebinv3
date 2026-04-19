import React, { useState } from 'react';
import './BinMonitoring.css';

const BinMonitoring = ({ bins, onResetBin }) => {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Summary per Bin Type
  const getTypeSummary = () => {
    const summary = bins.reduce((acc, bin) => {
      const shortType = getTypeShortName(bin.bin_type);
      if (!acc[shortType]) {
        acc[shortType] = { count: 0, full: 0, avgFill: 0 };
      }
      acc[shortType].count++;
      if (bin.status?.toUpperCase() === 'FULL') acc[shortType].full++;
      acc[shortType].avgFill += (bin.fill_level || 0);
      return acc;
    }, {});

    Object.keys(summary).forEach(type => {
      summary[type].avgFill = (summary[type].avgFill / summary[type].count).toFixed(1);
    });

    return summary;
  };

  const filteredBins = bins.filter(bin => {
    const typeMatch = filterType === 'all' || getTypeShortName(bin.bin_type) === filterType;
    const statusMatch = filterStatus === 'all' || bin.status?.toUpperCase() === filterStatus;
    return typeMatch && statusMatch;
  });

  return (
    <div className="bin-monitoring-professional">
      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Bin Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="Bio">Bio</option>
            <option value="Recycle">Recycle</option>
            <option value="Paper">Paper</option>
            <option value="Metal">Metal</option>
            <option value="Glass">Glass</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="NEAR_FULL">Near Full</option>
            <option value="FULL">Full</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Summary per Bin Type */}
      <div className="summary-section">
        <h3>Summary by Type</h3>
        <div className="summary-cards">
          {Object.entries(getTypeSummary()).map(([type, data]) => (
            <div key={type} className="summary-card">
              <div className="summary-type">{type}</div>
              <div className="summary-stats">
                <div className="stat-item">
                  <span className="stat-number">{data.count}</span>
                  <span className="stat-label">Total</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number danger">{data.full}</span>
                  <span className="stat-label">Full</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{data.avgFill}%</span>
                  <span className="stat-label">Avg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>{filteredBins.length} Bins • {bins.length} Total</h2>
        </div>
        <div className="table-responsive">
          <table className="professional-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Name</th>
                <th>Fill</th>
                <th>Status</th>
                <th>Weight</th>
                <th>Capacity</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {filteredBins.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <p>No bins match your filters</p>
                      <small>Try adjusting the filters above</small>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBins.map((bin) => (
                  <BinRowProfessional 
                    key={bin.bin_id} 
                    bin={bin}
                    onResetBin={onResetBin}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Professional Bin Row Component
const BinRowProfessional = ({ bin, onResetBin }) => {
  const fillLevel = bin.fill_level || 0;
  const weight = bin.weight || 0;
  const capacity = bin.capacity || 0;
  
  const getPriority = (capacity) => {
    if (capacity >= 90) return 'CRITICAL';
    if (capacity >= 76) return 'HIGH';
    if (capacity >= 51) return 'MEDIUM';
    return 'LOW';
  };

  const priority = getPriority(capacity);
  const priorityClass = getPriorityColor(capacity);

  const createFillBar = (level) => {
    const filled = Math.ceil(level / 10);
    const empty = 10 - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  return (
    <tr className={`pro-row priority-${priorityClass}`}>
      <td>
        <span className={`type-badge pro-type-${getTypeShortName(bin.bin_type)}`}>
          {getTypeShortName(bin.bin_type)}
        </span>
      </td>
      <td>
        <strong className="bin-name">{bin.bin_name}</strong>
      </td>
      <td className="fill-cell">
        <span className="visual-fill">{createFillBar(fillLevel)}</span>
        <small>{fillLevel.toFixed(0)}%</small>
      </td>
      <td>
        <span className={`pro-status-badge ${getStatusColor(bin.status)}`}>
          {bin.status || 'UNKNOWN'}
        </span>
      </td>
      <td>
        <span className="weight-badge">{weight.toFixed(1)}kg</span>
      </td>
      <td>
        <span className="capacity-badge">{capacity.toFixed(0)}%</span>
      </td>
      <td>
        <span className={`priority-badge pro-${priorityClass}`}>
          {priority}
        </span>
      </td>
    </tr>
  );
};

// Helper Functions
const getTypeShortName = (type) => {
  const t = type?.toLowerCase() || '';
  if (t.includes('organic') || t.includes('bio')) return 'Bio';
  if (t.includes('plastic') || t.includes('recyclable') || t.includes('recycle')) return 'Recycle';
  if (t.includes('paper')) return 'Paper';
  if (t.includes('metal')) return 'Metal';
  if (t.includes('glass')) return 'Glass';
  return 'Other';
};

const getPriorityColor = (capacity) => {
  if (capacity >= 90) return 'critical';
  if (capacity >= 76) return 'high';
  if (capacity >= 51) return 'medium';
  return 'low';
};

const getStatusColor = (status) => {
  const s = status?.toUpperCase();
  switch(s) {
    case 'ACTIVE': return 'status-active';
    case 'NEAR_FULL': return 'status-near-full';
    case 'FULL': return 'status-full';
    case 'MAINTENANCE': return 'status-maintenance';
    default: return 'status-unknown';
  }
};

export default BinMonitoring;