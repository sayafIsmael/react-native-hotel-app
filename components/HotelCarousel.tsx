import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';

const HotelCarousel = ({ images }: { images: string[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderCarouselItem = ({ item }: { item: string }) => (
    <View style={styles.carouselItem}>
      <Image source={{ uri: item }} style={styles.carouselImage} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        data={images}
        renderItem={renderCarouselItem}
        sliderWidth={350}
        itemWidth={350}
        onSnapToItem={(index) => setActiveIndex(index)}
      />
      <Pagination
        dotsLength={images.length}
        activeDotIndex={activeIndex}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.paginationDot}
        inactiveDotStyle={styles.paginationDotInactive}
        inactiveDotOpacity={0.6}
        inactiveDotScale={0.8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carouselImage: {
    width: 350,
    height: 200,
    borderRadius: 10,
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    paddingVertical: 5,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#5a67d8', // Active dot color
  },
  paginationDotInactive: {
    backgroundColor: '#ccc', // Inactive dot color
  },
});

export default HotelCarousel;
