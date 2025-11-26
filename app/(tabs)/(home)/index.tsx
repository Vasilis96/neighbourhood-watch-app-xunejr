
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { IncidentCard } from '@/components/IncidentCard';
import { mockIncidents } from '@/data/mockData';
import { Incident } from '@/types';

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSeverity, setSelectedSeverity] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'theft', label: 'Theft', icon: 'shopping_bag', customImage: require('@/assets/images/7bacf5e5-45f8-4dcf-aa5e-2e631be80713.png') },
    { id: 'suspicious', label: 'Suspicious', icon: 'visibility' },
    { id: 'accident', label: 'Accident', icon: 'car_crash', customImage: require('@/assets/images/20d64fa0-2835-4573-aaac-0bb18890b435.png') },
    { id: 'fire', label: 'Fire', icon: 'local_fire_department' },
    { id: 'vandalism', label: 'Vandalism', icon: 'warning' },
  ];

  const severities = [
    { id: 'all', label: 'All', color: colors.textSecondary },
    { id: 'low', label: 'Low', color: colors.success },
    { id: 'medium', label: 'Medium', color: colors.warning },
    { id: 'high', label: 'High', color: colors.error },
    { id: 'critical', label: 'Critical', color: '#B71C1C' },
  ];

  const filteredIncidents = mockIncidents.filter((incident) => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === 'all' || incident.category === selectedCategory;
    const matchesSeverity = !selectedSeverity || selectedSeverity === 'all' || incident.severity === selectedSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Safety Feed</Text>
        <Text style={styles.headerSubtitle}>Real-time incidents in your area</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search incidents..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {categories.map((category, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    (selectedCategory === category.id || (!selectedCategory && category.id === 'all')) &&
                      styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
                >
                  {category.customImage ? (
                    <Image
                      source={category.customImage}
                      style={[
                        styles.categoryImage,
                        {
                          tintColor: selectedCategory === category.id || (!selectedCategory && category.id === 'all')
                            ? colors.card
                            : colors.text
                        }
                      ]}
                    />
                  ) : (
                    <IconSymbol
                      ios_icon_name={category.icon}
                      android_material_icon_name={category.icon}
                      size={16}
                      color={
                        selectedCategory === category.id || (!selectedCategory && category.id === 'all')
                          ? colors.card
                          : colors.text
                      }
                    />
                  )}
                  <Text
                    style={[
                      styles.filterChipText,
                      (selectedCategory === category.id || (!selectedCategory && category.id === 'all')) &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Severity</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {severities.map((severity, index) => (
              <React.Fragment key={index}>
                <TouchableOpacity
                  style={[
                    styles.filterChip,
                    (selectedSeverity === severity.id || (!selectedSeverity && severity.id === 'all')) &&
                      styles.filterChipActive,
                  ]}
                  onPress={() => setSelectedSeverity(severity.id === 'all' ? null : severity.id)}
                >
                  <View
                    style={[
                      styles.severityDot,
                      { backgroundColor: severity.color },
                    ]}
                  />
                  <Text
                    style={[
                      styles.filterChipText,
                      (selectedSeverity === severity.id || (!selectedSeverity && severity.id === 'all')) &&
                        styles.filterChipTextActive,
                    ]}
                  >
                    {severity.label}
                  </Text>
                </TouchableOpacity>
              </React.Fragment>
            ))}
          </ScrollView>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{mockIncidents.length}</Text>
            <Text style={styles.statLabel}>Total Incidents</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {mockIncidents.filter((i) => i.status === 'active').length}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {mockIncidents.filter((i) => i.confirmed).length}
            </Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
        </View>

        <View style={styles.incidentsHeader}>
          <Text style={styles.incidentsTitle}>Recent Incidents</Text>
          <TouchableOpacity style={styles.reportButton}>
            <IconSymbol
              ios_icon_name="plus.circle.fill"
              android_material_icon_name="add_circle"
              size={20}
              color={colors.card}
            />
            <Text style={styles.reportButtonText}>Report</Text>
          </TouchableOpacity>
        </View>

        {filteredIncidents.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="checkmark.shield.fill"
              android_material_icon_name="verified_user"
              size={64}
              color={colors.success}
            />
            <Text style={styles.emptyStateText}>No incidents found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery || selectedCategory || selectedSeverity
                ? 'Try adjusting your filters'
                : 'Your neighborhood is safe!'}
            </Text>
          </View>
        ) : (
          filteredIncidents.map((incident, index) => (
            <React.Fragment key={index}>
              <IncidentCard
                incident={incident}
                onPress={() => console.log('Incident pressed:', incident.id)}
              />
            </React.Fragment>
          ))
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
    backgroundColor: colors.primary,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.text,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  filterScroll: {
    paddingRight: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 6,
  },
  filterChipTextActive: {
    color: colors.card,
  },
  categoryImage: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
  },
  severityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  incidentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  incidentsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  reportButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
    marginLeft: 6,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
