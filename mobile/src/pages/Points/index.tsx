import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Settings, Alert } from 'react-native';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps'; //mapa
import { SvgUri } from 'react-native-svg'; //permite receber imagens em svg de algo externo
import api from '../../services/api'; //importando api
import * as Location from 'expo-location';

// informando o tipo do item
interface Item {
    id: number;
    title: string;
    image: string;
}

//informando o tipo do point
interface Point {
    id: number;
    image: string;
    image_url: string;
    name: string;
    latitude: number;
    longitude: number;
}

interface Params {
    uf: string;
    city: string;
}

const Points = () => {
    //FUNCAO PARA A ACAO DOS BOTOES
    //a função abaixo sera usada no onPress do button levando o usuario para a pagina anterior
    const navigation = useNavigation();

    function handleNavigationBack() {
        navigation.goBack();
    }

    // navega para a proxima pagina
    function handleNavigationToDetail(id: number) {
        //esta funcao recebe o id do point clicado como parametro
        //abaixo, tudo que estiver no {objeto} vai ser passado como parametro para a proxima rota
        navigation.navigate('Detail', { point_id: id });
    }

    //CAPTURANDO E ARMAZENANDO MEUS ITEMS QUE ESTAO NO BANCO DE DADOS
    //resgatando os items
    const [items, setItems] = useState<Item[]>([]);
    //capturando os items selecionados
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    useEffect(() =>{
        api.get('items').then(response => {
            setItems(response.data);
        })
    }, []);

    //funcao para armazenar o item
    function handleSelectedItem(id: number) {
        const alreadySelected= selectedItems.findIndex(item => item === id);

        if(alreadySelected >= 0) {
            const filteredItems= selectedItems.filter(item => item !== id);

            setSelectedItems(filteredItems);
        } else {
            setSelectedItems([ ...selectedItems,id ]);
        }
    }

    //PEGANDO A LOCALIZAÇAO DO USUARIO
    //armazenando a localizaçao
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);

    //funcao de captura da localizacao
    useEffect(() => {
        async function loadPosition() {
            //pedindo permissões do usuario se podemos identificar a localizacao dele
            //verificando se o usuario permitiu ou nao
            const { status } = await Location.requestPermissionsAsync();

            //se a permissao for negado, um alerta é mostrado
            if(status !== 'granted') {
                Alert.alert('Ooops.....', 'Precisamos de sua permissão para obter a localização!')
                return; //o codigo para
            }

            //se a permissao for aceita, pego a localizacao atual
            const location = await Location.getCurrentPositionAsync();
            const { latitude, longitude } = location.coords; //pego a latitude/longitude de coords

            //setando as coordenadas
            setInitialPosition([
                latitude,
                longitude
            ]);
        }

        loadPosition();
    }, []);

    //PEGANDO OS PARAMETROS DA ROTA ANTERIOR
    const route = useRoute();
    //definindo um formato para essa variavel de forma forçada
    const routeParams = route.params as Params;

    //CARREGANDO OS POINTS FILTRADOS UTILIZANDO DO QUERY.PARAMS
    //armazenando os points
    const [points, setPoints] = useState<Point[]>([]);

    //capturando os points ja feitos
    useEffect(() => {
        api.get('points', {
            params: {
                uf: routeParams.uf,
                city: routeParams.city,
                items: selectedItems
            }
        }).then(response => {
            setPoints(response.data);
        })
    }, [selectedItems]);

    return (
        <>
            <View style={styles.container}>
                {/* botao */}
                <TouchableOpacity onPress={handleNavigationBack}>
                    <Icon name='arrow-left' size={20} color='#34CB79' />
                </TouchableOpacity>

                {/* texto */}
                <Text style={styles.title}>Bem Vindo.</Text>
                <Text style={styles.description}>Encontre no mapa um ponto de coleta.</Text>

                {/* mapa */}
                <View style={styles.mapContainer}>
                    {/* se intialPosition for diferente de 0, inicia o mapa */}
                    { initialPosition[0] !== 0 && (
                        <MapView 
                            style={styles.map}
                            loadingEnabled={initialPosition[0] === 0}
                            initialRegion={{
                                latitude: initialPosition[0],
                                longitude: initialPosition[1],
                                latitudeDelta: 0.014,
                                longitudeDelta: 0.014
                            }}
                        >
                            {/* pino de marcação */}
                            {points.map(point => (
                                <Marker
                                    key={String(point.id)}
                                    style={styles.mapMarker}
                                    onPress={() => handleNavigationToDetail(point.id)}
                                    coordinate={{
                                        latitude: point.latitude,
                                        longitude: point.longitude,
                                    }}
                                >
                                    {/* imagem do pino de marcação */}
                                    <View style={styles.mapMarkerContainer}>
                                        <Image style={styles.mapMarkerImage} source={{ uri: point.image_url }} />
                                        <Text style={styles.mapMarkerTitle}>{point.name}</Text>
                                    </View>
                                </Marker>
                            ))}
                        </MapView>
                    ) }
                </View>

                {/* items */}
                <View style={styles.itemsContainer}>
                    <ScrollView 
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 20 }}
                    >
                        {items.map(item => (
                            <TouchableOpacity 
                                key={String(item.id)} 
                                style={[
                                    styles.item,
                                    selectedItems.includes(item.id) ? styles.selectedItem : {}
                                ]}  
                                onPress={() => handleSelectedItem(item.id)}
                                activeOpacity={0.6}
                            >
                                <SvgUri width={42} height={42} uri={item.image} />
                                <Text style={styles.itemTitle}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });

export default Points;