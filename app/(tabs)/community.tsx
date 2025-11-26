
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { EventCard } from '@/components/EventCard';
import { mockChannels, mockEvents, mockNeighbors } from '@/data/mockData';

type TabType = 'channels' | 'events' | 'neighbors';

export default function CommunityScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('channels');
  const [events, setEvents] = useState(mockEvents);

  const handleRSVP = (eventId: string, status: 'going' | 'interested' | 'not-going') => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, rsvpStatus: status } : event
    ));
    console.log(`RSVP ${status} for event ${eventId}`);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      general: 'forum',
      safety: 'shield',
      events: 'event',
      marketplace: 'shopping_bag',
      help: 'help',
    };
    return icons[category] || 'forum';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>Connect with your neighbors</Text>
      </View>

      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'channels' && styles.tabActive]}
          onPress={() => setActiveTab('channels')}
        >
          <IconSymbol
            ios_icon_name="bubble.left.and.bubble.right.fill"
            android_material_icon_name="forum"
            size={20}
            color={activeTab === 'channels' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'channels' && styles.tabTextActive]}>
            Channels
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'events' && styles.tabActive]}
          onPress={() => setActiveTab('events')}
        >
          <IconSymbol
            ios_icon_name="calendar"
            android_material_icon_name="event"
            size={20}
            color={activeTab === 'events' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'events' && styles.tabTextActive]}>
            Events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'neighbors' && styles.tabActive]}
          onPress={() => setActiveTab('neighbors')}
        >
          <IconSymbol
            ios_icon_name="person.2.fill"
            android_material_icon_name="people"
            size={20}
            color={activeTab === 'neighbors' ? colors.primary : colors.textSecondary}
          />
          <Text style={[styles.tabText, activeTab === 'neighbors' && styles.tabTextActive]}>
            Neighbors
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'channels' && (
          <View>
            {mockChannels.map((channel, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.channelCard}
                  onPress={() => console.log('Channel pressed:', channel.id)}
                >
                  <View style={[styles.channelIcon, { backgroundColor: colors.primary }]}>
                    <IconSymbol
                      ios_icon_name={getCategoryIcon(channel.category)}
                      android_material_icon_name={channel.icon}
                      size={24}
                      color={colors.card}
                    />
                  </View>
                  <View style={styles.channelContent}>
                    <Text style={styles.channelName}>{channel.name}</Text>
                    <Text style={styles.channelDescription} numberOfLines={1}>
                      {channel.description}
                    </Text>
                    <View style={styles.channelMeta}>
                      <View style={styles.channelMetaItem}>
                        <IconSymbol
                          ios_icon_name="person.2.fill"
                          android_material_icon_name="people"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.channelMetaText}>{channel.memberCount} members</Text>
                      </View>
                      <Text style={styles.channelMetaText}>
                        • Active {formatTimeAgo(channel.lastActivity)}
                      </Text>
                    </View>
                  </View>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="chevron_right"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        )}

        {activeTab === 'events' && (
          <View>
            <View style={styles.eventsHeader}>
              <Text style={styles.eventsTitle}>Upcoming Events</Text>
              <TouchableOpacity style={styles.createButton}>
                <IconSymbol
                  ios_icon_name="plus.circle.fill"
                  android_material_icon_name="add_circle"
                  size={20}
                  color={colors.card}
                />
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
            {events.map((event, index) => (
              <React.Fragment key={index}>
                <EventCard
                  event={event}
                  onPress={() => console.log('Event pressed:', event.id)}
                  onRSVP={(status) => handleRSVP(event.id, status)}
                />
              </React.Fragment>
            ))}
          </View>
        )}

        {activeTab === 'neighbors' && (
          <View>
            <View style={styles.neighborsHeader}>
              <Text style={styles.neighborsTitle}>Neighbors Directory</Text>
              <Text style={styles.neighborsSubtitle}>
                {mockNeighbors.length} neighbors in your area
              </Text>
            </View>
            {mockNeighbors.map((neighbor, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={styles.neighborCard}
                  onPress={() => console.log('Neighbor pressed:', neighbor.id)}
                >
                  <View style={styles.neighborAvatar}>
                    <IconSymbol
                      ios_icon_name="person.fill"
                      android_material_icon_name="person"
                      size={24}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.neighborContent}>
                    <View style={styles.neighborHeader}>
                      <Text style={styles.neighborName}>{neighbor.name}</Text>
                      {neighbor.verified && (
                        <IconSymbol
                          ios_icon_name="checkmark.seal.fill"
                          android_material_icon_name="verified"
                          size={16}
                          color={colors.accent}
                        />
                      )}
                    </View>
                    {neighbor.bio && (
                      <Text style={styles.neighborBio} numberOfLines={2}>
                        {neighbor.bio}
                      </Text>
                    )}
                    <View style={styles.neighborTags}>
                      {neighbor.tags.slice(0, 2).map((tag, tagIndex) => (
                        <React.Fragment key={tagIndex}>
                          <View style={styles.tag}>
                            <Text style={styles.tagText}>{tag}</Text>
                          </View>
                        </React.Fragment>
                      ))}
                      {neighbor.tags.length > 2 && (
                        <Text style={styles.moreTagsText}>+{neighbor.tags.length - 2}</Text>
                      )}
                    </View>
                  </View>
                  <IconSymbol
                    ios_icon_name="chevron.right"
                    android_material_icon_name="chevron_right"
                    size={20}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 48 : 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.secondary,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.card,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.background,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginLeft: 6,
  },
  tabTextActive: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  channelIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  channelContent: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  channelDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  channelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  channelMetaText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eventsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  createButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 6,
  },
  neighborsHeader: {
    marginBottom: 16,
  },
  neighborsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  neighborsSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  neighborCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  neighborAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  neighborContent: {
    flex: 1,
  },
  neighborHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  neighborName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginRight: 6,
  },
  neighborBio: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  neighborTags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primary,
  },
  moreTagsText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
