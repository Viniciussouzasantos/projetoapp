import * as React from 'react';
import{View, Text} from 'react-native';
//import { Text, View } from "../components/Themed";
import { StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const db = SQLite.openDatabase("appvendadb.banco");




export default function Perfil() {
    const [perfil, setPerfil] = React.useState([]);
  
    React.useEffect(() => {
      db.transaction((tx) => {
        tx.executeSql("select * from perfil", [], (_, { rows: { _array } }) => {
          console.log("placeholder")
          setPerfil(_array);   
        });
      });
    }, []);

    return(
        <View style={{flex: 1}}>
            <Text style={tela.rotulos}>Perfil</Text>
            {perfil.map(
        ({
          id,
          idusuario,
          nomeusuario,
          foto,
          nomecliente,
          cpf,
          
          email,
          telefone,
          tipo,
          logradouro,
          numero,
          complemento,
          bairro,
          cep,
          logado,
        }) => (
          <View style={{ flex: 1 }} key={id}>
            <Image
             source={{ uri: `http://10.26.45.48/vinicius_souza/loja/img/${foto}` }}
              style={tela.img}
            />
            <Text style={tela.txtrotulos}>Usuário:{nomeusuario}</Text>
            <Text  style={tela.txtrotulos}>Nome:{nomecliente}</Text>
            <Text  style={tela.txtrotulos}>CPF:{cpf}</Text>
        
            <Text  style={tela.txtrotulos}>E-Mail:{email}</Text>
            <Text  style={tela.txtrotulos}>Telefone:{telefone}</Text>
            <Text  style={tela.txtrotulos}>Tipo:{tipo}</Text>
            <Text  style={tela.txtrotulos}>Logradouro:{logradouro}</Text>
            <Text  style={tela.txtrotulos}>Número:{numero}</Text>
            <Text  style={tela.txtrotulos}>Complemento:{complemento}</Text>
            <Text  style={tela.txtrotulos}>Bairro:{bairro}</Text>
            <Text  style={tela.txtrotulos}>CEP:{cep}</Text>

            <TouchableOpacity>
              <Text  style={tela.txtrotulos}>Atualizar Perfil</Text>
            </TouchableOpacity>
          </View>
        )
      )}

      <TouchableOpacity onPress={()=>{
        db.transaction((lk) => {
          lk.executeSql("drop table perfil");
            alert("placeholder")
       
        });
      }}>
        <Text  style={tela.txtrotulos}>Sair do perfil</Text>
      </TouchableOpacity>
        </View>
    );
}

const tela = StyleSheet.create({
    img: {
      width: 100,
      height: 1,
      flex: 1,
      
      resizeMode: "contain",
    },
    link: {
      padding: 10,
    },
perfil:{
backgroundColor:'green',

},
rotulos:{
  width:150,
  //textAlign:'center',
  padding:5,
  fontWeight:'bold'
},
txtrotulos:{

  marginLeft:10
}



  });