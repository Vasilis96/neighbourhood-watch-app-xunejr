
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Incident } from '@/types';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface IncidentCardProps {
  incident: Incident;
  onPress?: () => void;
}

export function IncidentCard({ incident, onPress }: IncidentCardProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      theft: 'shopping_bag',
      vandalism: 'warning',
      suspicious: 'visibility',
      accident: 'car_crash',
      fire: 'local_fire_department',
      medical: 'medical_services',
      other: 'info',
    };
    return icons[category] || 'info';
  };

  const getCategoryImage = (category: string) => {
    if (category === 'theft') {
      return require('@/assets/images/7bacf5e5-45f8-4dcf-aa5e-2e631be80713.png');
    }
    return null;
  };

  const getSeverityColor = (severity: string) => {
    const severityColors: Record<string, string> = {
      low: colors.success,
      medium: colors.warning,
      high: colors.error,
      critical: '#B71C1C',
    };
    return severityColors[severity] || colors.textSecondary;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const categoryImage = getCategoryImage(incident.category);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          {incident.userPhoto ? (
            <Image source={{ uri: incident.userPhoto }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <IconSymbol
                ios_icon_name="person.fill"
                android_material_icon_name="person"
                size={20}
                color={colors.textSecondary}
              />
            </View>
          )}
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{incident.userName}</Text>
            <Text style={styles.timestamp}>{getTimeAgo(incident.timestamp)}</Text>
          </View>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(incident.severity) }]}>
          <Text style={styles.severityText}>{incident.severity.toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.categoryRow}>
          {categoryImage ? (
            <Image
              source={categoryImage}
              style={[styles.categoryImage, { tintColor: colors.primary }]}
            />
          ) : (
            <IconSymbol
              ios_icon_name={getCategoryIcon(incident.category)}
              android_material_icon_name={getCategoryIcon(incident.category)}
              size={20}
              color={colors.primary}
            />
          )}
          <Text style={styles.category}>{incident.category.toUpperCase()}</Text>
        </View>
        <Text style={styles.title}>{incident.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {incident.description}
        </Text>
        <View style={styles.locationRow}>
          <IconSymbol
            ios_icon_name="location.fill"
            android_material_icon_name="location_on"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={styles.location}>{incident.location.address}</Text>
        </View>
      </View>

      {incident.media && incident.media.length > 0 && (
        <Image source={{ uri: incident.media[0] }} style={styles.media} />
      )}

      <View style={styles.footer}>
        <View style={styles.confirmations}>
          <IconSymbol
            ios_icon_name="checkmark.circle.fill"
            android_material_icon_name="check_circle"
            size={18}
            color={incident.confirmed ? colors.success : colors.textSecondary}
          />
          <Text style={styles.confirmationText}>
            {incident.confirmations} {incident.confirmations === 1 ? 'confirmation' : 'confirmations'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: incident.status === 'resolved' ? colors.success : colors.info }]}>
          <Text style={styles.statusText}>{incident.status.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.card,
  },
  content: {
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  categoryImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  media: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmations: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.card,
  },
});
