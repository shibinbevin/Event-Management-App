import React from 'react';
import { Card as RBCard } from 'react-bootstrap';

interface CardProps {
    title: string;
    count: string;
}

const Card: React.FC<CardProps> = ({ title, count }) => {
    return (
        <RBCard className="shadow-sm">
            <RBCard.Body>
                <RBCard.Title className="text-center">{title}</RBCard.Title>
                <RBCard.Text className="text-center display-4">{count}</RBCard.Text>
            </RBCard.Body>
        </RBCard>
    );
}

export default Card;
