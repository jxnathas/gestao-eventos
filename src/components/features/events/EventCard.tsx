import { ButtonLink } from "../../ui/ButtonLink";
import { Card } from "../../ui/Card";
import Image from "next/image";
import type { Event } from '@/types';

export const EventCard = ({ event }: { event: Event }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative h-48">
        <Image
        src={event.bannerUrl ? event.bannerUrl : '/default-event.jpg'}
        alt={event.name}
        fill
        className="object-cover"
        />
    </div>
    <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
        <p className="text-gray-500 mb-1">
        📅 {new Date(event.date).toLocaleDateString('pt-BR')}
        </p>
        <p className="text-gray-500 mb-3">📍 {event.location}</p>
    
        <ButtonLink
        href={`/event/${event.id}`}
        variant="primary"
        className="w-full"
        >
        Ver Detalhes
        </ButtonLink>
    </div>
    </Card>
);