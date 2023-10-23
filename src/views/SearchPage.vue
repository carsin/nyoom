<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
        <ion-button class="back" slot="end" fill="outline" href="/">Log Out</ion-button>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar show-clear-button="focus" placeholder="Search vehicles by make, model, or owner"></ion-searchbar>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title size="large">Select Make</ion-title>
      </ion-toolbar>

    </ion-header>
      <ion-content :fullscreen="true">
        <ion-grid>
          <ion-row v-for="brand in brandList">
            <ion-col size="6">
              <ion-card :href="brand[0].link">
                <ion-title align="center">
                  <img :alt="brand[0].brandName" :src="brand[0].picture" :height="brand[0].height" :width="brand[0].width"/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>{{ brand[0].brandName }}</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="6">
              <ion-card :href="brand[1].link">
                <ion-title align="center"> 
                  <img :alt="brand[1].brandName" :src="brand[1].picture" :height="brand[1].height" :width="brand[1].width"/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>{{ brand[1].brandName }}</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>
  
          <!-- <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Acura logo" src="../assets/logos/acura.png" height='200' width='200'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Acura</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Alfo Romeo logo" src="../assets/logos/alfo_romeo.png" height='200' width='200'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Alfa Romeo</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Aston Martin logo" src="../assets/logos/aston_martin.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Aston Martin</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Audi logo" src="../assets/logos/audi.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Audi</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Bentley logo" src="../assets/logos/bentley.png" height='200' width='350'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Bentley</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="BMW logo" src="../assets/logos/bmw.png" height='200' width='200'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>BMW</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Buick logo" src="../assets/logos/buick.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Buick</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Cadillac logo" src="../assets/logos/cadillac.png" height='200' width='350'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Cadillac</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Chevrolet logo" src="../assets/logos/chevrolet.png" height='200' width='350'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Chevrolet</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Chrysler logo" src="../assets/logos/chrysler.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Chrysler</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Corvette logo" src="../assets/logos/corvette.png" height='200' width='350'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Corvette</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Dodge logo" src="../assets/logos/dodge.png" height='200' width='350'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Dodge</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Ferrari logo" src="../assets/logos/ferrari.png" height='200' width='125'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Ferrari</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center" class="wide">
                  <img alt="Fiat logo" src="../assets/logos/fiat.png" height='200' width='400'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Fiat</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Ford logo" src="../assets/logos/ford.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Ford</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="GMC logo" src="../assets/logos/gmc.png" height='200' width='400'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>GMC</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Honda logo" src="../assets/logos/honda.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Honda</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="hyundai logo" src="../assets/logos/hyundai.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Hyundai</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Infiniti logo" src="../assets/logos/infiniti.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Infiniti</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Jaguar logo" src="../assets/logos/jaguar.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Jaguar</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Jeep logo" src="../assets/logos/jeep.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Jeep</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Kia logo" src="../assets/logos/kia.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Kia</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Koenigsegg logo" src="../assets/logos/koenigsegg.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Koenigsegg</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Lamborghini logo" src="../assets/logos/Lamborghini.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Lamborghini</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Land Rover logo" src="../assets/logos/land_rover.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Land Rover</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Lexus logo" src="../assets/logos/lexus.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Lexus</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Lotus logo" src="../assets/logos/lotus.png" height='200' width='200'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Lotus</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Maserati logo" src="../assets/logos/maserati.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Maserati</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Mazda logo" src="../assets/logos/mazda.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Mazda</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="McLaren logo" src="../assets/logos/mclaren.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>McLaren</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Mercedes-Benz logo" src="../assets/logos/mercedes.png" height='200' width='200'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Mercedes-Benz</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Mini logo" src="../assets/logos/mini.png" height='200' width='300'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Mini</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Mitsubishi logo" src="../assets/logos/mitsubishi.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Mitsubishi</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Nissan logo" src="../assets/logos/nissan.png" height='200' width='225'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Nissan</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Porsche logo" src="../assets/logos/porsche.png" height='200' width='170'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Porsche</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="RAM logo" src="../assets/logos/ram.png" height='200' width='350'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>RAM</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Rolls Royce logo" src="../assets/logos/rolls_royce.png" height='200' width='125'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Rolls Royce</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Subaru logo" src="../assets/logos/subaru.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Subaru</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Tesla logo" src="../assets/logos/tesla.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Tesla</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row>

          <ion-row>
            <ion-col size="4">
              <ion-card href="audiModels">
                <ion-title align="center">
                  <img alt="Toyota logo" src="../assets/logos/audi.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                    <ion-card-subtitle>Toyota</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Volkswagen logo" src="../assets/logos/volkswagen.png" height='200' width='200'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Volkswagen</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Volvo logo" src="../assets/logos/volvo.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Volvo</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
          </ion-row> -->

        </ion-grid>
      </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}

.wide{
  padding-inline: 0px;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonSearchbar, IonImg } from '@ionic/vue';
import { CarBrands } from "../types/CarBrads";

const acura = new CarBrands("Acura", "audiModels", "150", "250", "@src/assets/logos/acura.png");
const alfoRomeo = new CarBrands("Alfo Romeo", "audiModels", "150", "250", "src/assets/logos/alfo_romeo.png");
const astonMartin = new CarBrands("Aston Martin", "audiModels", "200", "250", "src/assets/logos/aston_martin.png");
const audi = new CarBrands("Audi", "audiModels", "200", "250", "src/assets/logos/audi.png");
const bentley = new CarBrands("Bentley", "audiModels", "200", "250", "src/assets/logos/bentley.png");
const bmw = new CarBrands("BMW", "audiModels", "200", "250", "src/assets/logos/bmw.png");
const buick = new CarBrands("Buick", "audiModels", "200", "250", "src/assets/logos/buick.png");
const cadillac = new CarBrands("Cadillac", "audiModels", "200", "250", "src/assets/logos/cadillac.png");
const chevrolet = new CarBrands("Chevrolet", "audiModels", "200", "250", "src/assets/logos/chevrolet.png");
const chrysler = new CarBrands("Chrysler", "audiModels", "200", "250", "src/assets/logos/chrysler.png");
const corvette = new CarBrands("Corvette", "audiModels", "200", "250", "src/assets/logos/corvette.png");
const dodge = new CarBrands("Dodge", "audiModels", "200", "250", "src/assets/logos/dodge.png");
const ferrari = new CarBrands("Ferrari", "audiModels", "200", "250", "src/assets/logos/ferrari.png");
const fiat = new CarBrands("Fiat", "audiModels", "200", "250", "src/assets/logos/fiat.png");
const ford = new CarBrands("Ford", "audiModels", "200", "250", "src/assets/logos/ford.png");
const gmc = new CarBrands("GMC", "audiModels", "200", "250", "src/assets/logos/gmc.png");
const honda = new CarBrands("Honda", "audiModels", "200", "250", "src/assets/logos/honda.png");
const hyundai = new CarBrands("Hyundai", "audiModels", "200", "250", "src/assets/logos/hyundai.png");
const infiniti = new CarBrands("Infiniti", "audiModels", "200", "250", "src/assets/logos/infiniti.png");
const jaguar = new CarBrands("Jaguar", "audiModels", "200", "250", "src/assets/logos/jaguar.png");
const jeep = new CarBrands("Jeep", "audiModels", "200", "250", "src/assets/logos/jeep.png");
const kia = new CarBrands("Kia", "audiModels", "200", "250", "src/assets/logos/kia.png");
const koenigsegg = new CarBrands("Koenigsegg", "audiModels", "200", "250", "src/assets/logos/koenigsegg.png");
const lamborghini = new CarBrands("Lamborghini", "audiModels", "200", "250", "src/assets/logos/lamborghini.png");
const landRover = new CarBrands("Land Rover", "audiModels", "200", "250", "src/assets/logos/land_rover.png");
const lexus = new CarBrands("Lexus", "audiModels", "200", "250", "src/assets/logos/lexus.png");
const lotus = new CarBrands("Lotus", "audiModels", "200", "250", "src/assets/logos/lotus.png");
const maserati = new CarBrands("Maserati", "audiModels", "200", "250", "src/assets/logos/maserati.png");
const mazda = new CarBrands("Mazda", "audiModels", "200", "250", "src/assets/logos/mazda.png");
const mclaren = new CarBrands("McLaren", "audiModels", "200", "250", "src/assets/logos/mclaren.png");
const mercedes = new CarBrands("Mercedes-Benz", "audiModels", "200", "250", "src/assets/logos/mercedes.png");
const mini = new CarBrands("Mini", "audiModels", "200", "250", "src/assets/logos/mini.png");
const mitsubishi = new CarBrands("Mitsubishi", "audiModels", "200", "250", "src/assets/logos/mitsubishi.png");
const nissan = new CarBrands("Nissan", "audiModels", "200", "250", "src/assets/logos/nissan.png");
const porsche = new CarBrands("Porsche", "audiModels", "200", "250", "src/assets/logos/porsche.png");
const ram = new CarBrands("Ram", "audiModels", "200", "250", "src/assets/logos/ram.png");
const rollsRoyce = new CarBrands("Rolls Royce", "audiModels", "200", "250", "src/assets/logos/rolls_royce.png");
const subaru = new CarBrands("Subaru", "audiModels", "200", "250", "src/assets/logos/subaru.png");
const tesla = new CarBrands("Tesla", "audiModels", "200", "250", "src/assets/logos/tesla.png");
const toyota = new CarBrands("Toyota", "audiModels", "200", "250", "src/assets/logos/toyota.png");
const volkswagen = new CarBrands("Volkswagen", "audiModels", "200", "250", "src/assets/logos/volkswagen.png");
const volvo = new CarBrands("Volvo", "audiModels", "200", "250", "src/assets/logos/volvo.png");

const brandList = [
  [acura, alfoRomeo], [astonMartin, audi], [bentley, bmw], [buick, cadillac], [chevrolet, chrysler],
  [corvette, dodge], [ferrari, fiat], [ford, gmc], [honda, hyundai], [infiniti, jaguar],[jeep, kia],
  [koenigsegg, lamborghini], [landRover, lexus], [lotus, maserati],[mazda, mclaren], [mercedes, mini],
  [mitsubishi, nissan], [porsche, ram], [rollsRoyce, subaru],[tesla, toyota], [volkswagen, volvo]
  ];
</script>
