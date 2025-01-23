import { useState, useEffect } from 'react';
import { Table } from './layout/Table';
import { AddEventModal } from './layout/AddEventModal';
import { EditEventModal } from './layout/EditEventModal';
import { DeleteEventModal } from './layout/DeleteEventModal';
import { Plus } from 'lucide-react';
import { TabsContent } from "@/components/ui/tabs"
import axiosInstance from '@/services/axiosInstance';

export type Event = {
  id: string;
  title: string;
  venue: string;
  date: string;
  type: string;
  level_id: string;
  level: string;
};


export function EventsList() {
  const [eventsList, setEventsList] = useState<Event[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
  const [loading, setLoading] = useState(true)


  const handleEditEvent = (updatedEvent: Event) => {
    setEvents(events.map(event => event.id === updatedEvent.id ? updatedEvent : event));
    setIsEditModalOpen(false);
  };


  const fetchLevel = async (level_id: string) => {
    try {
      const response = await axiosInstance.get(`/levels/${level_id}`);
      if (response.status === 200) {
        const level = response.data;
        return `${level.name} ${level.semester}`;
      }
    } catch (error) {
      console.error(error);
    }
    return '';
  }

  const fetchEvents = async () => {
    try {
      const response = await axiosInstance.get('/events');
      if (response.status === 200) {
        const events = response.data;
        const newEvents = await Promise.all(
          events.map(async (event) => ({
            ...event,
            level: await fetchLevel(event.level_id)
          }))
        )
        setEventsList(newEvents);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error', error);
    } 
  };

  useEffect(() => {
    fetchEvents();
  }, [])

  return (
    <>
    <TabsContent value="events">
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Events Management</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Add Event
          </button>
        </div>
      </div>

      <Table
        events={eventsList}
        onEdit={(event) => {
          setSelectedEvent(event);
          setIsEditModalOpen(true);
        }}
        onDelete={(event) => {
          setSelectedEvent(event);
          setIsDeleteModalOpen(true);
        }}
        loading={loading}
      />

      <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchEvents();
        }}
      />

      {selectedEvent && (
        <>
          <EditEventModal
            isOpen={isEditModalOpen}
            onClose={() => {setIsEditModalOpen(false); fetchEvents();}}
            event={selectedEvent}
            onEdit={handleEditEvent}
          />
          <DeleteEventModal
            isOpen={isDeleteModalOpen}
            onClose={() => {setIsDeleteModalOpen(false); fetchEvents();}}
            event={selectedEvent}
          />
        </>
      )}
    </div>
    </TabsContent>
    </>
  );
}