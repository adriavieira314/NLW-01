import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
//stack: telas anteriores não deixam de existir e eu posso voltar pra elas
import { createStackNavigator } from '@react-navigation/stack';

import Home from './pages/Home';
import Points from './pages/Points';
import Detail from './pages/Detail';

const AppStack = createStackNavigator();

const Routes = () => {
    return (
        <NavigationContainer>
            <AppStack.Navigator 
                headerMode='none' 
                screenOptions={{
                    cardStyle: {
                        backgroundColor: '#f0f0f5'
                    } 
                }}
            >
                <AppStack.Screen name='Home' component={Home} />
                <AppStack.Screen name='Points' component={Points} />
                <AppStack.Screen name='Detail' component={Detail} />
            </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default Routes;