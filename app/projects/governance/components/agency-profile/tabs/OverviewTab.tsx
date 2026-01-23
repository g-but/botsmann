'use client';

import React from 'react';
import { AgencyData, formatCurrency, getTrendColor } from '../types';

interface OverviewTabProps {
  agency: AgencyData;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({ agency }) => (
  <div>
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <div className="px-4 py-5 sm:px-6">
        <h2 className="text-lg font-medium text-gray-900">Agency Overview</h2>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">{agency.description}</p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="sm:divide-y sm:divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Budget Allocation</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="mb-2">
                <div className="flex justify-between text-sm">
                  <span>Allocated: {formatCurrency(agency.budget.allocated)}</span>
                  <span>Spent: {formatCurrency(agency.budget.spent)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${(agency.budget.spent / agency.budget.allocated) * 100}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-xs text-gray-500">Fiscal Year: {agency.budget.fiscalYear}</p>
            </dd>
          </div>
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Services Impact</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-2xl font-bold text-blue-600">
                    {agency.citizenImpact.servicesProvided.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">Services Provided</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600">
                    {agency.citizenImpact.citizensServed.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">Citizens Served</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600">
                    {agency.citizenImpact.satisfactionScore}%
                  </span>
                  <span className="text-xs text-gray-500">Satisfaction Score</span>
                </div>
                <div>
                  <span className="block text-2xl font-bold text-blue-600">
                    {agency.citizenImpact.avgResponseTime}
                  </span>
                  <span className="text-xs text-gray-500">Average Response Time</span>
                </div>
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </div>

    {/* Agency Metrics */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {agency.metrics.map((metric, index) => (
        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">{metric.name}</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{metric.value}</dd>
            <dd className={`mt-1 text-sm ${getTrendColor(metric.trend)}`}>{metric.change}</dd>
          </div>
        </div>
      ))}
    </div>
  </div>
);
