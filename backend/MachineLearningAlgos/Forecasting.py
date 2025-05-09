import pandas as pd
from prophet import Prophet
import sys
import json

def forecast_expenses(data):
    df = pd.DataFrame(data)
    df['ds'] = pd.to_datetime(df['date']).dt.tz_localize(None)  
    df['y'] = df['amount']
    df = df[['ds', 'y']]

    if len(df) < 5:
        return {"message": "Not enough data to forecast, Add Atleast 5 expenses."}

    model = Prophet()
    model.fit(df)

    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    past_avg = df['y'].tail(30).mean()
    future_avg = forecast.tail(30)['yhat'].mean()

    alert = None
    if future_avg >= past_avg * 1.15:
        alert = "Your spending is projected to increase by over 15% next month."
    elif future_avg < past_avg * 0.85:
        alert = "Great job! Your spending is expected to decrease next month."


    forecast['ds'] = pd.to_datetime(forecast['ds'])

    forecast.set_index('ds', inplace=True)

    weekly_forecast = forecast['yhat'].resample('W').mean().reset_index()

    forecast_output = weekly_forecast.tail(4) 

    output = {
        "forecast": forecast_output.to_dict(orient="records"),
        "alert": alert
    }

    return output

if __name__ == "__main__":
    try:
        data = json.loads(sys.stdin.read())
        result = forecast_expenses(data)
        print(json.dumps(result, default=str))  
    except Exception as e:
        print(json.dumps({"error": str(e)}))
