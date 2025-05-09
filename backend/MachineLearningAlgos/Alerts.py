import pandas as pd
import numpy as np
import json
import sys
from datetime import datetime, timedelta
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler


input_data = json.loads(sys.stdin.read())
df = pd.DataFrame(input_data)


def generate_goal_alerts(goals_df):
    alerts = []
    
    if goals_df.empty:
        return []
    
    
    if 'endDate' in goals_df.columns:
        goals_df['endDate'] = pd.to_datetime(goals_df['endDate'])
    
    
    goals_df['progress_percentage'] = (goals_df['amount_saved'] / goals_df['amount']) * 100
    goals_df['days_left'] = (goals_df['endDate'] - datetime.now()).dt.days
    
    
    expired_goals = goals_df[goals_df['days_left'] < 0]
    for _, goal in expired_goals.iterrows():
        if goal['progress_percentage'] < 90:
            alerts.append({
                'severity': 'high',
                'type': 'goal_expired',
                'message': f"Goal '{goal['title']}' has expired with only {goal['progress_percentage']:.1f}% saved.",
                'goal_id': goal.get('_id', None)
            })
    
    
    active_goals = goals_df[goals_df['days_left'] >= 0]
    for _, goal in active_goals.iterrows():
        
        total_days = (goal['end_date'] - pd.to_datetime(goal.get('start_date', goal['end_date'] - timedelta(days=30)))).days
        elapsed_days = total_days - goal['days_left']
        expected_progress = (elapsed_days / total_days) * 100 if total_days > 0 else 0
        
        
        progress_gap = expected_progress - goal['progress_percentage']
        
        
        if progress_gap > 30 and goal['days_left'] < 15:
            alerts.append({
                'severity': 'high',
                'type': 'critical_shortfall',
                'message': f"Critical shortfall for '{goal['title']}': {progress_gap:.1f}% behind with only {goal['days_left']} days left.",
                'goal_id': goal.get('_id', None)
            })
        
        
        elif progress_gap > 15:
            alerts.append({
                'severity': 'medium',
                'type': 'behind_schedule',
                'message': f"Goal '{goal['title']}' is behind schedule by {progress_gap:.1f}%. Consider increasing contributions.",
                'goal_id': goal.get('_id', None)
            })
        
        
        elif goal['days_left'] < 7 and goal['progress_percentage'] < 90:
            alerts.append({
                'severity': 'medium',
                'type': 'deadline_approaching',
                'message': f"Goal '{goal['title']}' deadline is in {goal['days_left']} days but only {goal['progress_percentage']:.1f}% complete.",
                'goal_id': goal.get('_id', None)
            })
    
    return alerts


def detect_anomalies(goals_df):
    alerts = []
    
    if goals_df.empty or len(goals_df) < 3:  
        return alerts
    
    try:
        
        features = goals_df[['amount', 'amount_saved', 'progress_percentage']].fillna(0)
        
        
        scaler = StandardScaler()
        scaled_features = scaler.fit_transform(features)
        
        
        model = IsolationForest(contamination=0.1, random_state=42)
        preds = model.fit_predict(scaled_features)
        
        
        anomalies = goals_df[preds == -1]
        
        for _, goal in anomalies.iterrows():
            if goal['progress_percentage'] < 50:
                alerts.append({
                    'severity': 'medium',
                    'type': 'unusual_pattern',
                    'message': f"Unusual saving pattern detected for '{goal['title']}' with significantly lower progress than other goals.",
                    'goal_id': goal.get('_id', None)
                })
            elif goal['progress_percentage'] > 90:
                alerts.append({
                    'severity': 'low',
                    'type': 'positive_anomaly',
                    'message': f"Great work! Goal '{goal['title']}' is progressing exceptionally well compared to others.",
                    'goal_id': goal.get('_id', None)
                })
    except Exception as e:
        
        print(f"Error in anomaly detection: {str(e)}", file=sys.stderr)
    
    return alerts


goal_alerts = generate_goal_alerts(df)
anomaly_alerts = detect_anomalies(df)


all_alerts = goal_alerts + anomaly_alerts


severity_order = {'high': 0, 'medium': 1, 'low': 2}
all_alerts.sort(key=lambda x: severity_order.get(x['severity'], 99))


summary = ""
if all_alerts:
    high_priority = sum(1 for alert in all_alerts if alert['severity'] == 'high')
    if high_priority > 0:
        summary = f"⚠️ {high_priority} high priority alerts require your attention for your savings goals."
    else:
        behind_schedule = sum(1 for alert in all_alerts if alert['type'] == 'behind_schedule')
        if behind_schedule > 0:
            summary = f"⚠️ {behind_schedule} of your savings goals are behind schedule."
        else:
            summary = "Your savings goals need attention. Check your alerts for details."


response = {
    "alerts": all_alerts,
    "summary": summary,
    "count": len(all_alerts)
}


print(json.dumps(response))

