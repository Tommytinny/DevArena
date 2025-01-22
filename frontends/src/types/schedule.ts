export interface Event {
    id: string;
    title: string;
    date: string;
    type: string;
    venue: string;
  }
  
  export interface CalendarDay {
    date: Date;
    events: Event[];
  }