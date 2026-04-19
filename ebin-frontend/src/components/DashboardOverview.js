import React from 'react';
import './DashboardOverview.css';

const DashboardOverview = ({ data }) => {
  if (!data) {
    return <div className="overview-empty">Loading dashboard data...</div>;
  }

  // Calculate derived metrics
  const avgFillLevel = data.bins?.length > 0 
    ? ((data.bins.reduce((sum, bin) => sum + bin.fillLevel, 0) / data.bins.length).toFixed(1))
    : 0;
  
  const collectionEfficiency = data.collectionEfficiency || 0;
  
  const binStatusDist = data.bins?.reduce((acc, bin) => {
    if (bin.fillLevel >= 90) acc.full++;
    else if (bin.fillLevel >= 50) acc.half++;
    else acc.empty++;
    return acc;
  }, { full: 0, half: 0, empty: 0 }) || { full: 0, half: 0, empty: 0 };

  // Priority bins (top 3 critical/near full)
  const priorityBins = data.bins
    ?.filter(bin => bin.fillLevel >= 80)
    .sort((a, b) => b.fillLevel - a.fillLevel)
    .slice(0, 3) || [];

  const getStatusColor = (fillLevel) => {
    if (fillLevel >= 90) return 'bg-red-500 text-white';
    if (fillLevel >= 80) return 'bg-orange-500 text-white';
    if (fillLevel >= 50) return 'bg-yellow-500 text-gray-900';
    return 'bg-green-500 text-white';
  };

  const getStatusText = (fillLevel) => {
    if (fillLevel >= 90) return 'Critical';
    if (fillLevel >= 80) return 'Warning';
    return 'Normal';
  };

  return (
    <div className="overview-container">
      {/* KPIs Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Bins</div>
          <div className="kpi-number">{data.totalBins || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Avg Fill Level</div>
          <div className="kpi-number">{avgFillLevel}%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Full Bins</div>
          <div className="kpi-number">{data.fullBins || 0}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Collection Efficiency</div>
          <div className="kpi-number">{collectionEfficiency}%</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="charts-row">
        {/* Bin Status Distribution */}
        <div className="chart-card">
          <div className="chart-title">Bin Status Distribution</div>
          <div className="status-bars">
            <div className="status-bar">
              <div className="status-label">
                <span className="status-dot bg-red-500"></span> Full
              </div>
              <div className="status-value">{binStatusDist.full}</div>
            </div>
            <div className="status-bar">
              <div className="status-label">
                <span className="status-dot bg-yellow-500"></span> Half
              </div>
              <div className="status-value">{binStatusDist.half}</div>
            </div>
            <div className="status-bar">
              <div className="status-label">
                <span className="status-dot bg-green-500"></span> Empty
              </div>
              <div className="status-value">{binStatusDist.empty}</div>
            </div>
          </div>
        </div>

        {/* Waste Trend - CSS Sparkline */}
        <div className="chart-card">
          <div className="chart-title">Waste Trend (7 Days)</div>
          <div className="sparkline-container">
            <div className="sparkline">
              {data.wasteLast7Days?.slice(-7).map((day, index) => (
                <div 
                  key={index}
                  className="spark-point"
                  style={{ 
                    '--point-height': `${Math.min(day.kg / 5, 100)}%`
                  }}
                  title={`${day.date}: ${day.kg}kg`}
                ></div>
              )) || Array(7).fill().map((_, i) => (
                <div key={i} className="spark-point" title="No data"></div>
              ))}
            </div>
            <div className="spark-labels">
              <span>Mon</span>
              <span>Fri</span>
            </div>
          </div>
        </div>
      </div>

      {/* Priority Section */}
      <div className="priority-section">
        <div className="section-title">
          Priority Bins 
          <span className="priority-count">{priorityBins.length}</span>
        </div>
        <div className="priority-list">
          {priorityBins.length > 0 ? (
            priorityBins.map((bin, index) => (
              <div key={bin.id || index} className="priority-item">
                <div className="priority-id">{bin.id || `Bin ${index + 1}`}</div>
                <div className="priority-fill">
                  <div 
                    className={`fill-bar ${getStatusColor(bin.fillLevel).split(' ')[0]}`}
                    style={{ width: `${bin.fillLevel}%` }}
                  ></div>
                </div>
                <div className="priority-info">
                  <span className="fill-percent">{bin.fillLevel}%</span>
                  <span className={`status-tag ${getStatusColor(bin.fillLevel)}`}>
                    {getStatusText(bin.fillLevel)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-priority">✅ All bins normal</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;