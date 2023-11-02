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
          <div align="center"> <!-- TODO: remove align="center", it adds a code smell -->
            <ion-row>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img alt="Acura logo" src="../assets/logos/acura.png" height='100' max-width='100'/>
                  <ion-card-header>
                      <ion-card-subtitle>Acura</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Alfo Romeo logo" src="../assets/logos/alfo_romeo.png" height='100' max-width='100'/>
                  <ion-card-header>
                    <ion-card-subtitle>Alfa Romeo</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Aston Martin logo" src="../assets/logos/aston_martin.png" height='100' max-width='300'/>
                  <ion-card-header>
                    <ion-card-subtitle>Aston Martin</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Audi logo" src="../assets/logos/audi.png" height='100' max-width='250'/>
                  <ion-card-header>
                      <ion-card-subtitle>Audi</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Bentley logo" src="../assets/logos/bentley.png" height='100' max-width='350'/>
                  <ion-card-header>
                    <ion-card-subtitle>Bentley</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="BMW logo" src="../assets/logos/bmw.png" height='100' max-width='100'/>
                  <ion-card-header>
                    <ion-card-subtitle>BMW</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Buick logo" src="../assets/logos/buick.png" height='100' max-width='300'/>
                  <ion-card-header>
                      <ion-card-subtitle>Buick</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Cadillac logo" src="../assets/logos/cadillac.png" height='100' max-width='350'/>
                  <ion-card-header>
                    <ion-card-subtitle>Cadillac</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Chevrolet logo" src="../assets/logos/chevrolet.png" height='100' max-width='350'/>
                  <ion-card-header>
                    <ion-card-subtitle>Chevrolet</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Chrysler logo" src="../assets/logos/chrysler.png" height='100' max-width='250'/>
                  <ion-card-header>
                      <ion-card-subtitle>Chrysler</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Corvette logo" src="../assets/logos/corvette.png" height='100' max-width='350'/>
                  <ion-card-header>
                    <ion-card-subtitle>Corvette</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Dodge logo" src="../assets/logos/dodge.png" height='100' max-width='350'/>
                  <ion-card-header>
                    <ion-card-subtitle>Dodge</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Ferrari logo" src="../assets/logos/ferrari.png" height='100' max-width='50'/>
                  <ion-card-header>
                      <ion-card-subtitle>Ferrari</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <!-- <ion-title align="center" class="wide"> -->
                  <img class="center-align" alt="Fiat logo" src="../assets/logos/fiat.png" height='100' max-width='425'/>
                  <ion-card-header>
                    <ion-card-subtitle>Fiat</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Ford logo" src="../assets/logos/ford.png" height='100' max-width='300'/>
                  <ion-card-header>
                    <ion-card-subtitle>Ford</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="GMC logo" src="../assets/logos/gmc.png" height='100' max-width='600'/>
                  <ion-card-header>
                      <ion-card-subtitle>GMC</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Honda logo" src="../assets/logos/honda.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Honda</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="hyundai logo" src="../assets/logos/hyundai.png" height='100' max-width='300'/>
                  <ion-card-header>
                    <ion-card-subtitle>Hyundai</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Infiniti logo" src="../assets/logos/infiniti.png" height='100' max-width='300'/>
                  <ion-card-header>
                      <ion-card-subtitle>Infiniti</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Jaguar logo" src="../assets/logos/jaguar.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Jaguar</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Jeep logo" src="../assets/logos/jeep.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Jeep</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Kia logo" src="../assets/logos/kia.png" height='100' max-width='250'/>
                  <ion-card-header>
                      <ion-card-subtitle>Kia</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Koenigsegg logo" src="../assets/logos/koenigsegg.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Koenigsegg</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Lamborghini logo" src="../assets/logos/Lamborghini.png" height='100' max-width='400'/>
                  <ion-card-header>
                    <ion-card-subtitle>Lamborghini</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Land Rover logo" src="../assets/logos/land_rover.png" height='100' max-width='250'/>
                  <ion-card-header>
                      <ion-card-subtitle>Land Rover</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Lexus logo" src="../assets/logos/lexus.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Lexus</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Lotus logo" src="../assets/logos/lotus.png" height='100' max-width='175'/>
                  <ion-card-header>
                    <ion-card-subtitle>Lotus</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Maserati logo" src="../assets/logos/maserati.png" height='100' max-width='250'/>
                  <ion-card-header>
                      <ion-card-subtitle>Maserati</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Mazda logo" src="../assets/logos/mazda.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Mazda</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="McLaren logo" src="../assets/logos/mclaren.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>McLaren</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Mercedes-Benz logo" src="../assets/logos/mercedes.png" height='100' max-width='200'/>
                  <ion-card-header>
                      <ion-card-subtitle class="wider">Mercedes-Benz</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Mini logo" src="../assets/logos/mini.png" height='100' max-width='300'/>
                  <ion-card-header>
                    <ion-card-subtitle>Mini</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Mitsubishi logo" src="../assets/logos/mitsubishi.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Mitsubishi</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Nissan logo" src="../assets/logos/nissan.png" height='100' max-width='225'/>
                  <ion-card-header>
                      <ion-card-subtitle>Nissan</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Porsche logo" src="../assets/logos/porsche.png" height='100' max-width='125'/>
                  <ion-card-header>
                    <ion-card-subtitle>Porsche</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="RAM logo" src="../assets/logos/ram.png" height='100' max-width='350'/>
                  <ion-card-header>
                    <ion-card-subtitle>RAM</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Rolls Royce logo" src="../assets/logos/rolls_royce.png" height='100' max-width='125'/>
                  <ion-card-header>
                      <ion-card-subtitle>Rolls Royce</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                    <img class="center-align" alt="Subaru logo" src="../assets/logos/subaru.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Subaru</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Tesla logo" src="../assets/logos/tesla.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Tesla</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card href="audiModels">
                  <img class="center-align" alt="Toyota logo" src="../assets/logos/audi.png" height='100' max-width='250'/>
                  <ion-card-header>
                      <ion-card-subtitle>Toyota</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>

            <ion-row>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Volkswagen logo" src="../assets/logos/volkswagen.png" height='100' max-width='200'/>
                  <ion-card-header>
                    <ion-card-subtitle>Volkswagen</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
              <ion-col size="6">
                <ion-card>
                  <img class="center-align" alt="Volvo logo" src="../assets/logos/volvo.png" height='100' max-width='250'/>
                  <ion-card-header>
                    <ion-card-subtitle>Volvo</ion-card-subtitle>
                  </ion-card-header>
                </ion-card>
              </ion-col>
            </ion-row>
          </div>

        </ion-grid>
      </ion-content>
  </ion-page>
</template>

<style>
.back{
  padding-right: 15px;
}

.center-align{
  padding-top: 25px;
}

.wider{
  padding-inline: 0;
}
</style>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardSubtitle, IonSearchbar } from '@ionic/vue';
</script>
