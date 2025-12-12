export interface Post {
    id: number;
    platform:
    | "sms"
    | "whatsapp"
    | "pinterest"
    | "youtube"
    | "email"
    | "instagram"
    | "linkedin"
    | "facebook";
    campaign: string;
    message: string;
    scheduledTime: string; 
}


export interface CalendarEvent {
  id: number;
  title: string;              
  start: Date;                 
  end: Date;                   
  platform: string;           
  message: string;             
  campaign: string;            
}


interface CalendarHeaderProps {
  currentDate: Date;  
  viewMode: "month" | "week" | "day";
  onChangeView: (mode: "month" | "week" | "day") => void;
  onChangeDate: (date: Date) => void;
}

