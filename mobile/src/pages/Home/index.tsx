import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler'; //botao
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; //navegação pagina para outra
import RNPickerSelect from 'react-native-picker-select'; //dropdown
import axios from 'axios';

//informando o tipo
interface IBGEUFResponse {
    sigla: string;
}

interface IBGECityResponse {
    nome: string;
}

const Home = () => {
    //FUNCAO PARA A ACAO DOS BOTOES
    //a função abaixo sera usada no onPress do button levando o usuario para a pagina indicada, no caso Points
    const navigation = useNavigation();

    function handleNavigationToPoints() {
        navigation.navigate('Points', {
            uf: selectedUf,
            city: selectedCity
        });
    }

    //CAPTURANDO A UF E A CIDADE DA API DO IBGE
    //listando a cidade e o uf
    const [ufs, setUfs] = useState<string[]>([]);   
    const [city, setCity] = useState<string[]>([]);

    //armazenando a uf e cidade
    const [selectedUf, setSelectedUf] = useState('0');
    const [selectedCity, setSelectedCity] = useState('0');

    //pegando UF's da api do IBGE
    useEffect(() => {
        axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            const ufInitials = response.data.map(uf => uf.sigla);
            setUfs(ufInitials);
        });
    }, []);

    //listando a cidade baseado no que foi escolhido em uf
    useEffect(() => {
        if(selectedUf === '0') {
            return;
        }

        axios
            .get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome);
                setCity(cityNames);
            });
    }, [selectedUf]);

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <ImageBackground 
                source={require('../../assets/home-background.png')} 
                style={styles.container}
                imageStyle={{ width: 274, height: 368 }}
            >   
                {/* texto */}
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
                    <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
                </View>

                <View style={styles.footer}>
                    {/* inputs */}
                    <View style={styles.input}>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            placeholder={{label: 'Selecione uma UF', value: null, color: '#CCC'}}
                            onValueChange={(value) => setSelectedUf(value)}
                            value={selectedUf}
                            items={ufs.map(uf => (
                                {
                                    label: uf,
                                    value: uf,
                                }
                            ))}
                            Icon={() => {
                                return <Icon name='arrow-down' size={24} color='gray' />
                            }}
                        />
                    </View>
                    <View style={styles.input}>
                        <RNPickerSelect
                            useNativeAndroidPickerStyle={false}
                            placeholder={{label: 'Selecione uma UF', value: null, color: '#CCC'}}
                            onValueChange={(value) => setSelectedCity(value)}
                            value={selectedCity}
                            items={city.map((city) => (
                                {
                                    label: city,
                                    value: city,
                                }
                            ))}
                            Icon={() => {
                                return <Icon name='arrow-down' size={24} color='gray' />
                            }}
                        />
                    </View>

                    {/* botao */}
                    <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                        <View style={styles.buttonIcon}>
                            <Icon name='arrow-right' size={20} color='#FFF' />
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      paddingTop: 15,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;