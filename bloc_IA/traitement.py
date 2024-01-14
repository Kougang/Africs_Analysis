import numpy as np
import pandas as pd
import seaborn as sns # pour le pretraitement
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA

# chargement du fichier csv depuis drive
csv_file_entry = 'copie_tracking_history.csv'

fichier_pandas = pd.read_csv(csv_file_entry, sep=",")

# suppression des cellules null
pertinent = fichier_pandas.dropna(axis=1)

# suppression des donnees ligne dont les valeurs ne changent pas
data1 = pertinent.drop_duplicates()

# supression des valeurs colonne dont les valeurs ne changent pas:
data2 = data1.T.drop_duplicates().T

# ces colonnes restent invariantes, il faut donc les supprimer
data3 = data2.drop('gps_status', axis=1)
data = data3.drop('uniqueid', axis=1)

# informations sur le fichier souche
print("information sur le fichier pandas souche:\n", fichier_pandas.info())

# sffichage de la description des informations du fichier souche
# print("description du fichier pandas souche:\n", fichier_pandas.describe())


# Enregistrer les données modifiées dans un nouveau fichier CSV
data.to_csv('uniqueid-it_262536356333.csv', index=False)
uniqueid= pd.read_csv('uniqueid-it_262536356333.csv')

# module de convertion de la date en entier
uniqueid['ts'] = pd.to_datetime(uniqueid['ts'])
def date_to_integer(date):
    return int(date.timestamp())
uniqueid['ts_i'] = uniqueid['ts'].apply(date_to_integer)


# description du fichier contenant des informations resultats nettoyer, etant donne qu'on an un ensemble de donnees de type object et numerique
print("description du fichier pandas pretraite:\n", uniqueid.describe(include=['number', 'object']))

# ======================================================================================================
# apres affichage de la description on constate qu'il y'a un certain nombre de donnees qui reste invariant sur leurs colonne.
# il est question de les supprimer

# ======================================================================================================
#=======================================================================================================
# apres pretraitement on se retrouve a 15 colonnes contre 24 au depart et 985 lignes contre 1000 au depart
# maintenant nous pouvons commencer a observer nos donnee afin de degager des relations presente.
#=======================================================================================================
#=======================================================================================================

# determinons les colonnes avec les valeurs manquantes et sommons ces valeurs manquantes:
values_missing = uniqueid.isnull().sum()
print("nombre de valeurs manquantes:",values_missing)

# colum avec des valeurs manquantes:
colunns_missing = values_missing[values_missing > 0].index

# colonne avec valeurs manquantes:
print("colonnes avec valeurs manquantes:", colunns_missing)

# nombre total de valeurs manquantes par colonne: 
print("nombre total de valeurs manquante par colonne:",values_missing[colunns_missing])

# visualisation d'une colonne
# sns.boxplot(x=uniqueid['ts_i'])
# plt.show()

# analyse graphique
# histogramme
# plt.hist(uniqueid['lat'], bins=10, color='blue', alpha=0.7)
# plt.title('Distribution de la variable')
# plt.xlabel('Valeurs de la variable')
# plt.ylabel('Fréquence')
# plt.show()

# diagramme en barre
# Créer un diagramme en barres
# uniqueid['lat'].value_counts().plot(kind='bar', color='green', alpha=0.7)
# plt.title('Distribution de la variable catégorique')
# plt.xlabel('Catégories')
# plt.ylabel('Fréquence')
# plt.show()

# diagramme de dispersion:
# plt.scatter(uniqueid['fl_level'], uniqueid[ 'direction'], color='purple', alpha=0.5)
# plt.title('Graphique de dispersion entre Variable_X et Variable_Y')
# plt.xlabel('fl_level')
# plt.ylabel( 'direction')
# plt.show()

# Créer une matrice de graphiques de dispersion
# sns.pairplot(uniqueid[['fl_level', 'gsm_signal', 'direction']])
# plt.show()

# calculons la matrice de correlation entre les variables
# Vous pouvez sélectionner les colonnes d'intérêt pour l'analyse de la corrélation
# colonnes_selectionnees = ['Variable1', 'Variable2', 'Variable3']
# df_selection = uniqueid[colonnes_selectionnees]

print("# ===============================================================:#\n")
print("zone de calcul des correlations entre les variables:\n")
print("# ===============================================================:#\n")
# Calculer la matrice de corrélation
matrice_correlation = uniqueid.corr()

# Afficher la matrice de corrélation
print(matrice_correlation)

print("# ===============================================================:#\n")
print("carte de chaleur representant la correlations entre les variables:\n")
print("# ===============================================================:#\n")


# Créer une carte de chaleur (heatmap) à partir de la matrice de corrélation pour toutes les colonnes
sns.heatmap(matrice_correlation, annot=True, cmap='coolwarm', fmt=".2f")

# Ajouter des étiquettes et un titre
plt.title('Carte de chaleur de la corrélation entre toutes les variables')
plt.show()
print("# ===============================================================:#\n")
print("carte de chaleur des variables cibles:\n")
print("# ===============================================================:#\n")


colonnes_selectionnees = ['lat', 'lng', 'distance', 'hdop', 'ts_i', 'satellites']
df_selection = uniqueid[colonnes_selectionnees]

# Calculer la matrice de corrélation
matrice_correlation = df_selection.corr()

# Afficher la matrice de corrélation
print(matrice_correlation)
# print("# ===============================================================:#\n")
# print("graphique de dispersion entre les variables princial:\n")
# print("# ===============================================================:#\n")
# sns.pairplot(data=uniqueid[['lat', 'lng', 'distance', 'hdop', 'ts_i', 'satellites']])
# plt.show()

# print("# ===============================================================:#\n")
# print("essayons de clusteriser nos donnee avec l'algorithme des Kmeans:\n")
# print("# ===============================================================:#\n")

# # Sélectionner les attributs pour la clusterisation
# X = uniqueid[['lat', 'lng', 'distance', 'hdop', 'ts_i', 'satellites']]

# # Standardiser les données pour que toutes les caractéristiques aient la même échelle
# scaler = StandardScaler()
# X_scaled = scaler.fit_transform(X)

# # Spécifier le nombre de clusters (à adapter selon vos besoins)
# num_clusters = 3

# # Appliquer l'algorithme K-Means
# kmeans = KMeans(n_clusters=num_clusters, random_state=42)
# uniqueid['cluster'] = kmeans.fit_predict(X_scaled)

# # Visualiser les résultats de la clusterisation
# sns.pairplot(data=uniqueid, hue='cluster', vars=['lat', 'lng', 'distance', 'hdop', 'ts_i', 'satellites'])
# plt.show()

print("# ===============================================================:#\n")
print("clusterisation de nos variables:\n")
print("# ===============================================================:#\n")

# Supposons que df soit votre DataFrame avec les données
X = uniqueid[['lat', 'lng', 'distance', 'hdop', 'ts_i', 'satellites']]

# Standardiser les données
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Appliquer l'ACP pour réduire en 2 dimensions
pca = PCA(n_components=3)
X_pca = pca.fit_transform(X_scaled)

# Appliquer K-Means sur les données réduites
num_clusters = 2
kmeans = KMeans(n_clusters=num_clusters, random_state=40)
uniqueid['cluster'] = kmeans.fit_predict(X_scaled)

# Visualisation en 2D
plt.figure(figsize=(10, 8))

# Scatter plot des données réduites
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=uniqueid['cluster'], cmap='viridis', edgecolors='k', s=50, alpha=0.7)

# Centroides des clusters
centroids = kmeans.cluster_centers_
plt.scatter(centroids[:, 0], centroids[:, 1], c='red', marker='X', s=200, label='Centroids')

plt.title('Visualisation des clusters en 2D')
plt.xlabel('Première composante principale')
plt.ylabel('Deuxième composante principale')
plt.legend()
plt.show()
