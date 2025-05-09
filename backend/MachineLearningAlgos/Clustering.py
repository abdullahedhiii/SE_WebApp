import sys
import json
from sklearn.cluster import KMeans
import numpy as np

def main():
    
    input_data = sys.stdin.read()

    if not input_data:
        print(json.dumps({'error': 'No data received from Node.js.'}))
        return

    try:
        data = json.loads(input_data)  
    except json.JSONDecodeError as e:
        print(json.dumps({'error': 'Failed to decode JSON: ' + str(e)}))
        return

    if len(data) < 3:
        print(json.dumps({'error': 'Not enough data for clustering.'}))
        return

    
    X = np.array([[d['amount']] for d in data])

    
    n_clusters = min(3, len(data))

    try:
        kmeans = KMeans(n_clusters=n_clusters, n_init=10, random_state=0).fit(X)
        labels = kmeans.labels_.tolist()
        cluster_labels = {
            2: "Low Spending",      
            1: "Moderate Spending", 
            0: "High Spending",     
        }
        
        labeled_data = {
            'Low Spending' : [],
            'Moderate Spending' : [],
            'High Spending' : []
        }   
        for i, label in enumerate(labels):
            labeled_data[cluster_labels[label]].append(data[i])
        print(json.dumps(labeled_data))  
    except Exception as e:
        print(json.dumps({'error': f'Error during clustering: {str(e)}'}))

if __name__ == '__main__':
    main()
