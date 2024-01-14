import seaborn as sns
import pandas as pd
import matplotlib.pyplot as plt

# Charger les données depuis le fichier CSV
data = pd.read_csv("C:\tethaSpace\pythonSpace\Africs_Analysis\copie_tracking_history.csv")

# Compter les valeurs manquantes par colonne
missing_values = data.isnull().sum()

# Créer un graphique à barres des valeurs manquantes
plt.figure(figsize=(10, 6))
sns.barplot(x=missing_values.index, y=missing_values.values, palette="viridis")
plt.xticks(rotation=90)
plt.xlabel("Colonnes")
plt.ylabel("Nombre de valeurs manquantes")
plt.title("Colonnes avec des valeurs manquantes")
plt.tight_layout()

# Afficher le graphique
plt.show()