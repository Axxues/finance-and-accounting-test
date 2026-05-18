import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type TicketStatus = 'Todo' | 'In Progress' | 'Done';

export interface Ticket {
  id: string;
  code: string;
  description: string;
  steps: string;
  status: TicketStatus;
  complexity: 'Low' | 'Medium' | 'High';
  assignee: string;
  deadline: string;
  ticketType: string;
  remarks: string;
}

interface TicketState {
  tickets: Ticket[];
  ticketHistory: Ticket[];
}

interface TicketContextType extends TicketState {
  addTicket: (ticket: Omit<Ticket, 'id' | 'code' | 'status'>) => void;
  updateTicketStatus: (id: string, newStatus: TicketStatus) => void;
}

const initialState: TicketState = {
  tickets: [
    {
      id: 't-1',
      code: 'TKT-1023',
      description: 'Implement new tax calculation',
      steps: '1. Update formula in backend.\n2. Add UI toggle.',
      status: 'In Progress',
      complexity: 'Medium',
      assignee: 'Alice Smith',
      deadline: '2026-05-25',
      ticketType: 'Feature',
      remarks: 'High priority request'
    },
    {
      id: 't-2',
      code: 'TKT-1024',
      description: 'Fix AR aging report sorting',
      steps: '1. Debug sorting algorithm.',
      status: 'Todo',
      complexity: 'Low',
      assignee: 'Bob Jones',
      deadline: '2026-05-21',
      ticketType: 'Bug',
      remarks: 'Affects CFO dashboard'
    }
  ],
  ticketHistory: [
    {
      id: 't-3',
      code: 'TKT-1010',
      description: 'Setup initial GL accounts',
      steps: 'Import CSV of chart of accounts.',
      status: 'Done',
      complexity: 'Low',
      assignee: 'Alice Smith',
      deadline: '2026-05-15',
      ticketType: 'Task',
      remarks: 'Completed early'
    }
  ]
};

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TicketState>(() => {
    const saved = localStorage.getItem('ticket_state');
    if (saved) return JSON.parse(saved);
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem('ticket_state', JSON.stringify(state));
  }, [state]);

  const addTicket = (ticketData: Omit<Ticket, 'id' | 'code' | 'status'>) => {
    const newCode = `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket: Ticket = {
      ...ticketData,
      id: uuidv4(),
      code: newCode,
      status: 'Todo'
    };
    setState(s => ({ ...s, tickets: [...s.tickets, newTicket] }));
  };

  const updateTicketStatus = (id: string, newStatus: TicketStatus) => {
    setState(s => {
      const ticketToUpdate = s.tickets.find(t => t.id === id);
      if (!ticketToUpdate) return s;

      const updatedTicket = { ...ticketToUpdate, status: newStatus };

      if (newStatus === 'Done') {
        // Move to history
        return {
          ...s,
          tickets: s.tickets.filter(t => t.id !== id),
          ticketHistory: [...s.ticketHistory, updatedTicket]
        };
      } else {
        return {
          ...s,
          tickets: s.tickets.map(t => t.id === id ? updatedTicket : t)
        };
      }
    });
  };

  return (
    <TicketContext.Provider value={{ ...state, addTicket, updateTicketStatus }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
};
