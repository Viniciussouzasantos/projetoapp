import * as React from 'react';
import{View, Text, ActivityIndicator,Modal} from 'react-native';
import * as SQLite from 'expo-sqlite';
import{createStackNavigator} from '@react-navigation/stack'
import{ScrollView,StyleSheet,FlatList,Image, RefreshControl,Alert} from 'react-native';
import { TouchableOpacity , TouchableHighlight} from 'react-native-gesture-handler';




const Stack = createStackNavigator();
const db = SQLite.openDatabase("dbapploja.banco");
export default function Carrinho(){
   //Vamos criar ou abrir o banco de dados relacionada ao carrinho


return(
    <Stack.Navigator>
        <Stack.Screen name="ItensCarrinho" component = {ItensCarrinho} options ={{headerShown:false}} />
        <Stack.Screen name="Pagamento" component = {Pagamento} />
    </Stack.Navigator>
);
}

const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };
  


function ItensCarrinho({navigation}){
const[carregando,setCarregando] = React.useState (true);
    const [produtos, setProdutos] = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

//condificação de atualização dos controles de tela

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  db.transaction((tx) => {
    tx.executeSql("select * from carrinho", [], (_, { rows: { _array } }) => {
      setProdutos(_array);
    });
  });
  wait(2000).then(() => setRefreshing(false));
}, []);

    
    React.useEffect(()=>{

        db.transaction((sl)=>{
            sl.executeSql("select * from carrinho", [],(_,{rows})=>{
               // console.log("---------------------------------------");
             // console.log(JSON.stringify(rows,_array));
              setProdutos(rows._array );
              setCarregando(false);
            });
          });
    },[]); 
       
        return(
           
            <ScrollView horizontal = {true} style = {styles.scrollview}  refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              >
{carregando ? (<ActivityIndicator/>):(<FlatList data = {produtos} renderItem = {({item})=>(
    <View>
        <Text>Nome produto {item.nomeproduto}</Text>
        <Text>Preço R$ {item.preco}</Text>
        <TouchableOpacity onPress = {()=>{
           // alert("Clicou"); 
           db.transaction((ts)=>{
           ts.executeSql("delete from carrinho where id=?",[item.id]);
           alert("item excluido");
        
           })
        }} style = {styles.btnApagar}>
<Text style = {styles.txtApagar}>Excluir</Text>

        </TouchableOpacity>
        <TouchableOpacity onPress = {()=>{
  navigation.navigate("Pagamento")}} style ={styles.btnApagar}>
          <Text style = {styles.txtApagar}>pagar</Text>
          
         </TouchableOpacity>
        
        
    </View>
)}
keyExtractor = {({id},index) => id}
/>
)}



            </ScrollView>
        )
}

//-------------------------------------pagamento ----------------------------------------------------
function Pagamento(){
  
  
  return(
  <View>
           <Text>
            forma de pagamento        
         </Text>
         
          <TouchableOpacity onPress ={()=>{
alert("pagou")
          }} style = {styles.btnApagar}>
          <Text style ={styles.txtApagar}>
            credito
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress ={()=>{
alert("pagou")
          }} style = {styles.btnApagar}>
          <Text style ={styles.txtApagar}>
            debito
            </Text>
          </TouchableOpacity>
  </View>
)
}



const styles = StyleSheet.create({
scrollview:{
flex:1,
alignContent:'center'
//justifyContent: 'center'

},
btnApagar:{
    padding:10,
    backgroundColor:'green',
    margin:5
},
txtApagar:{
    color:'white',
},
header:{
backgroundColor:'green'

},centeredView: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: 22,
},
modalView: {
  margin: 20,
  backgroundColor: 'white',
  borderRadius: 20,
  padding: 35,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
},
openButton: {
  backgroundColor: '#F194FF',
  borderRadius: 20,
  padding: 10,
  elevation: 2,
},
textStyle: {
  color: 'white',
  fontWeight: 'bold',
  textAlign: 'center',
},
modalText: {
  marginBottom: 15,
  textAlign: 'center',
},
});



// function pagarModal(){
//   const [modalVisible, setModalVisible] = React.useState(false);
//   return (
//     <View style={styles.centeredView}>
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           Alert.alert('Modal has been closed.');
//         }}>
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Hello World!</Text>

//             <TouchableHighlight
//               style={{ ...styles.openButton, backgroundColor: '#2196F3' }}
//               onPress={() => {
//                 setModalVisible(!modalVisible);
//               }}>
//               <Text style={styles.textStyle}>Hide Modal</Text>
//             </TouchableHighlight>
//           </View>
//         </View>
//       </Modal>

//       <TouchableHighlight
//         style={styles.openButton}
//         onPress={() => {
//           setModalVisible(true);
//         }}>
//         <Text style={styles.textStyle}>Show Modal</Text>
//       </TouchableHighlight>
//     </View>
//   );
// }