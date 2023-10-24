<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Search</ion-title>
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
          <ion-row>
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
                  <img alt="Bentley logo" src="../assets/logos/bentley.png" height='200' width='300'/>
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
                  <img alt="Cadillac logo" src="../assets/logos/cadillac.png" height='200' width='250'/>
                </ion-title>
                <ion-card-header>
                  <ion-card-subtitle>Cadillac</ion-card-subtitle>
                </ion-card-header>
              </ion-card>
            </ion-col>
            <ion-col size="4">
              <ion-card>
                <ion-title align="center">
                  <img alt="Chevrolet logo" src="../assets/logos/chevrolet.png" height='200' width='275'/>
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
                <ion-title align="center">
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
                  <img alt="Lamborghini logo" src="../assets/logos/lamborghini.png" height='200' width='300'/>
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
          </ion-row>

        </ion-grid>
      </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonSearchbar } from '@ionic/vue';
</script>
