
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Event } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  onRSVP?: (status: 'going' | 'interested' | 'not-going') => void;
}

export function EventCard({ event, onPress, onRSVP }: EventCardProps) {
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      social: colors.secondary,
      safety: colors.error,
      cleanup: colors.success,
      meeting: colors.primary,
      workshop: colors.accent,
    };
    return categoryColors[category] || colors.primary;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {event.image && (
        <Image source={{ uri: event.image }} style={styles.image} />
      )}
      
      <View style={styles.content}>
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(event.category) }]}>
          <Text style={styles.categoryText}>{event.category.toUpperCase()}</Text>
        </View>

        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {event.description}
        </Text>

        <View style={styles.infoRow}>
          <IconSymbol
            ios_icon_name="calendar"
            android_material_icon_name="event"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>{formatDate(event.date)} at {event.time}</Text>
        </View>

        <View style={styles.infoRow}>
          <IconSymbol
            ios_icon_name="location.fill"
            android_material_icon_name="location_on"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>{event.location}</Text>
        </View>

        <View style={styles.infoRow}>
          <IconSymbol
            ios_icon_name="person.fill"
            android_material_icon_name="person"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.infoText}>
            {event.attendees} attending
            {event.maxAttendees && ` / ${event.maxAttendees} max`}
          </Text>
        </View>

        <View style={styles.organizerRow}>
          <Text style={styles.organizerLabel}>Organized by:</Text>
          <Text style={styles.organizerName}>{event.organizer}</Text>
        </View>

        {onRSVP && (
          <View style={styles.rsvpButtons}>
            <TouchableOpacity
              style={[
                styles.rsvpButton,
                event.rsvpStatus === 'going' && styles.rsvpButtonActive,
              ]}
              onPress={() => onRSVP('going')}
            >
              <Text style={[
                styles.rsvpButtonText,
                event.rsvpStatus === 'going' && styles.rsvpButtonTextActive,
              ]}>
                Going
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.rsvpButton,
                event.rsvpStatus === 'interested' && styles.rsvpButtonActive,
              ]}
              onPress={() => onRSVP('interested')}
            >
              <Text style={[
                styles.rsvpButtonText,
                event.rsvpStatus === 'interested' && styles.rsvpButtonTextActive,
              ]}>
                Interested
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 16,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  organizerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  organizerLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginRight: 6,
  },
  organizerName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  rsvpButtons: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  rsvpButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  rsvpButtonActive: {
    backgroundColor: colors.primary,
  },
  rsvpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  rsvpButtonTextActive: {
    color: colors.card,
  },
});
