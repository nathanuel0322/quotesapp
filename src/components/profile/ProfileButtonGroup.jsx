import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Text} from 'react-native';

import {Content} from './Content';
import {Services} from './Services';
import {Info} from './Info';
import {Reviews} from './Reviews';
import ContentFilled from '../../assets/icons/content-filled.svg';
import ContentTransparent from '../../assets/images/content-transparent.svg'; 
import InfoFilled from '../../assets/icons/info-filled.svg';
import InfoTransparent from '../../assets/icons/info-transparent.svg';
import ReviewsFilled from '../../assets/icons/reviews-filled.svg';
import ReviewsTransparent from '../../assets/images/reviews-transparent.svg';
import ServicesFilled from '../../assets/icons/services-filled.svg';
import ServicesTransparent from '../../assets/images/services-transparent.svg';
import GlobalStyles from '../../GlobalStyles';

let page, setPage;

export const ProfileButtonGroup = () => {
  [page, setPage] = useState('content');

  const handlePage = (event, newPage) => {
    setPage(newPage);
  };

  return(
    <View>
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => setPage('content')}>
          {page === 'content' ? 
            <View style={styles.buttonview}>
              <ContentFilled width={30} height={30} />
              <Text style={styles.buttontext}>
                Content
              </Text>
            </View>
          :
            <ContentTransparent 
              width={30}
              height={30}
            />   
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {setPage('services')}}>
          {page === 'services' ? 
            <View style={styles.buttonview}>
              <ServicesFilled width={30} height={30} />
              <Text style={styles.buttontext}>
                Services
              </Text>
            </View>
          :
            <ServicesTransparent 
              width={30}
              height={30}
            />   
          }
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => setPage('info')}>
          {page === 'info' ? 
            <View style={styles.buttonview}>
              <InfoFilled width={30} height={30} />
              <Text style={[styles.buttontext, {top: 2,}]}>
                Info
              </Text>
            </View>
          :
            <InfoTransparent 
              width={30}
              height={30}
            />   
          }
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => setPage('reviews')}
        >
          {page === 'reviews' ? 
            <View style={styles.buttonview}>
              <ReviewsFilled width={30} height={30} />
              <Text style={styles.buttontext}>
                Reviews
              </Text>
            </View>
          :
            <ReviewsTransparent 
              width={30}
              height={30}
              // preserveAspectRatio="none"
            />   
          }
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 75}}>
        <Text>
          {page === 'content' && <Content />}
          {page === 'services' && <Services />}
          {page === 'info' && <Info />}
          {page === 'reviews' && <Reviews />}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: -55,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
  },

  buttonview: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttontext: {
    color: 'white',
    fontFamily: GlobalStyles.fontSet.fontsemibold,
    marginLeft: 5,
    fontSize: 16,
  }
})

export default page;
 