import React, { useEffect, useState, useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { Hotel, useHotelStore } from '../hooks/hotelStore';
import axios from 'axios';
import StarRating from 'react-native-star-rating';
import HotelCarousel from '../components/HotelCarousel';

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const hotels = useHotelStore(state => state.hotels);
  const perPage = 10;
  const flatListRef = useRef<FlatList>(null);

  const scrollToTop = () => {
    if (flatListRef && flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/hotels');
        useHotelStore.getState().addHotels(response.data.hotels);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching hotels:', error);
        setLoading(false);
      }
    };

    if (hotels.length === 0) {
      fetchHotels();
    }
  }, []); 

  const handlePrevPage = () => {
    setPage(prevPage => Math.max(prevPage - 1, 1));
    scrollToTop();
  };

  const handleNextPage = () => {
    setPage(prevPage => Math.min(prevPage + 1, totalPages));
    scrollToTop();
  };

  const totalPages = Math.ceil(hotels.length / perPage);
  const startIndex = (page - 1) * perPage;
  const paginatedHotels = hotels.slice(startIndex, startIndex + perPage); 

  const renderItem = ({ item }: {item: Hotel}) => (
    <Card style={styles.card}>
      <HotelCarousel images={item.images} />
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph style={styles.price}>Price: ${item.price}</Paragraph>
        <Paragraph style={styles.location}>Location: {item.location}</Paragraph>
        <View style={styles.amenitiesContainer}>
          {item.amenities.map((amenity: string, index: number) => (
            <Text key={index} style={styles.amenity}>{amenity}</Text>
          ))}
        </View>
        <Paragraph>
          <StarRating
            disabled={true}
            maxStars={5}
            rating={item.rating}
            starSize={20}
            fullStarColor="#FFD700"
          />
        </Paragraph>
      </Card.Content>
    </Card>
  );
  

  const isPrevButtonDisabled = page === 1;
  const isNextButtonDisabled = page === totalPages;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={paginatedHotels}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.paginationContainer}>
        <Button
          mode="contained"
          onPress={handlePrevPage}
          disabled={isPrevButtonDisabled}
          style={styles.paginationButton}
        >
          Prev
        </Button>
        <Text style={styles.paginationText}>
          Page {page} of {totalPages}
        </Text>
        <Button
          mode="contained"
          onPress={handleNextPage}
          disabled={isNextButtonDisabled}
          style={styles.paginationButton}
        >
          Next
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  paginationButton: {
    borderRadius: 20,
  },
  paginationText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  location: {
    marginBottom: 5,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  amenity: {
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#e6e6fa',
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
});

export default HomeScreen;
