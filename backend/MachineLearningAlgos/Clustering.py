import sys
import json
from sklearn.cluster import KMeans
import numpy as np

def main():
    # Read from stdin
    input_data = sys.stdin.read()

    if not input_data:
        print(json.dumps({'error': 'No data received from Node.js.'}))
        return

    try:
        data = json.loads(input_data)  # Parse the JSON data received from Node.js
    except json.JSONDecodeError as e:
        print(json.dumps({'error': 'Failed to decode JSON: ' + str(e)}))
        return

    if len(data) < 3:
        print(json.dumps({'error': 'Not enough data for clustering.'}))
        return

    # Convert to numerical data
    X = np.array([[d['amount']] for d in data])

    # Dynamically adjust n_clusters based on data length
    n_clusters = min(3, len(data))

    try:
        kmeans = KMeans(n_clusters=n_clusters, n_init=10, random_state=0).fit(X)
        labels = kmeans.labels_.tolist()
        cluster_labels = {
            2: "Low Spending",      # Cluster 0 represents low spending
            1: "Moderate Spending", # Cluster 1 represents moderate spending
            0: "High Spending",     # Cluster 2 represents high spending
        }
        # label_1 : {} ,label_2 : {} ,label_3 : {}
        labeled_data = {
            'Low Spending' : [],
            'Moderate Spending' : [],
            'High Spending' : []
        }   
        for i, label in enumerate(labels):
            labeled_data[cluster_labels[label]].append(data[i])
        print(json.dumps(labeled_data))  # Output labels for Node.js
    except Exception as e:
        print(json.dumps({'error': f'Error during clustering: {str(e)}'}))

if __name__ == '__main__':
    main()
