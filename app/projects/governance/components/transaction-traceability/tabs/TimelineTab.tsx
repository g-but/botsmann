'use client';

import React from 'react';
import { EnhancedTransaction } from '../types';

interface TimelineTabProps {
  timeline: EnhancedTransaction['timeline'];
}

export const TimelineTab: React.FC<TimelineTabProps> = ({ timeline }) => (
  <div>
    <h3 className="text-lg font-medium text-gray-900">Transaction Timeline</h3>
    <p className="mt-1 text-sm text-gray-500">
      Complete history of this transaction from approval to completion.
    </p>

    <div className="flow-root mt-6">
      <ul className="-mb-8">
        {timeline.map((item, index) => (
          <li key={index}>
            <div className="relative pb-8">
              {index !== timeline.length - 1 ? (
                <span
                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                ></span>
              ) : null}
              <div className="relative flex space-x-3">
                <div>
                  <span
                    className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      index === timeline.length - 1 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    <svg
                      className="h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <div className="text-right text-sm whitespace-nowrap text-gray-500">
                    <time dateTime={item.date}>{item.date}</time>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
