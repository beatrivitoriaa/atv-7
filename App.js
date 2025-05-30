import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TextInput, TouchableOpacity, Linking } from 'react-native';

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('Recife,PE');
  const [inputCity, setInputCity] = useState('');

  const API_KEY = '87bb0d17';
  const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
  const apiUrl = `https://api.hgbrasil.com/weather?key=${API_KEY}&city_name=${city}`;

  const fetchWeather = () => {
    setLoading(true);
    setError(null);
    
    fetch(proxyUrl + apiUrl)
      .then((response) => {
        if (!response.ok) throw new Error('Erro na resposta da API');
        return response.json();
      })
      .then((json) => {
        setWeather(json.results);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const handleCityChange = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      setInputCity('');
    }
  };

  const requestCorsAccess = () => {
    Linking.openURL('https://cors-anywhere.herokuapp.com/corsdemo');
  };

  if (loading && !weather) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Carregando dados do clima...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <Text style={styles.noteText}>Se for um erro de CORS, você precisa:</Text>
        <TouchableOpacity onPress={requestCorsAccess} style={styles.corsButton}>
          <Text style={styles.corsButtonText}>Liberar acesso temporário</Text>
        </TouchableOpacity>
        <Text style={styles.noteText}>Clique no botão acima e depois em "Request temporary access to the demo server"</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite uma cidade (ex: São Paulo,SP)"
          value={inputCity}
          onChangeText={setInputCity}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleCityChange}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.currentWeather}>
        <Text style={styles.title}>Clima em {weather.city}</Text>
        <Text style={styles.temp}>{weather.temp}°C</Text>
        <Text style={styles.description}>{weather.description}</Text>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Humidade</Text>
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Vento</Text>
            <Text style={styles.detailValue}>{weather.wind_speedy}</Text>
          </View>
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nascer do sol</Text>
            <Text style={styles.detailValue}>{weather.sunrise}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Pôr do sol</Text>
            <Text style={styles.detailValue}>{weather.sunset}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.forecastTitle}>Previsão dos próximos dias:</Text>
      {weather.forecast.map((day, index) => (
        <View key={index} style={styles.forecastItem}>
          <Text style={styles.forecastDate}>{day.weekday} - {day.date}</Text>
          <Text style={styles.forecastDescription}>{day.description}</Text>
          <View style={styles.tempContainer}>
            <Text style={styles.minTemp}>Min: {day.min}°C</Text>
            <Text style={styles.maxTemp}>Max: {day.max}°C</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#f5f7fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f7fa',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  noteText: {
    color: '#555',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
  corsButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  corsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginRight: 10,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  currentWeather: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  temp: {
    fontSize: 72,
    fontWeight: '200',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  description: {
    fontSize: 18,
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  detailItem: {
    flex: 1,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  forecastItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  forecastDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  forecastDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  minTemp: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  maxTemp: {
    color: '#e74c3c',
    fontWeight: 'bold',
  },
});