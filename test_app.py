"""
Automated Test Suite for Credit Card Fraud Detection Application
Tests API endpoints, Model Inference, Accuracy Metrics, and Preset Scenarios.
"""

import json
import unittest
from app import app, load_artifacts

class CreditCardFraudDetectionTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        load_artifacts()

    def test_01_index_page(self):
        """Verify the main UI dashboard loads with status 200"""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Credit Card Fraud Detection', response.data)
        self.assertIn(b'Ambati Venkatesh', response.data)
        self.assertIn(b'Vadodara, Gujarat', response.data)

    def test_02_about_api(self):
        """Verify about API returns complete team leadership and location metadata"""
        response = self.client.get('/api/about')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['team_leader'], 'Ambati Venkatesh')
        self.assertIn('Mallapuram Venkatarao', data['team_members'])
        self.assertIn('Nunavath Ramesh', data['team_members'])
        self.assertIn('Vineeth', data['team_members'])
        self.assertEqual(data['location'], 'Vadodara, Gujarat')

    def test_03_samples_api(self):
        """Verify preloaded 1-click test scenarios are available"""
        response = self.client.get('/api/samples')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('legitimate', data)
        self.assertIn('fraudulent', data)
        self.assertIn('suspicious_edge', data)

    def test_04_metrics_api(self):
        """Verify benchmark metrics API returns both Random Forest and Boosting models"""
        response = self.client.get('/api/metrics')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('models', data)
        self.assertIn('random_forest', data['models'])
        self.assertIn('gradient_boosting', data['models'])
        self.assertGreater(data['models']['random_forest']['roc_auc'], 90.0)

    def test_05_predict_legitimate_transaction(self):
        """Verify model classifies legitimate transaction correctly"""
        samples_res = self.client.get('/api/samples')
        sample_legit = samples_res.get_json()['legitimate']['data']

        payload = {
            'model_type': 'random_forest',
            'threshold': 0.50,
            'features': sample_legit
        }
        res = self.client.post('/api/predict', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['prediction'], 'LEGITIMATE')
        self.assertFalse(data['is_fraud'])
        self.assertLess(data['fraud_probability'], 0.50)

    def test_06_predict_fraudulent_transaction(self):
        """Verify model classifies fraudulent transaction correctly"""
        samples_res = self.client.get('/api/samples')
        sample_fraud = samples_res.get_json()['fraudulent']['data']

        payload = {
            'model_type': 'gradient_boosting',
            'threshold': 0.50,
            'features': sample_fraud
        }
        res = self.client.post('/api/predict', data=json.dumps(payload), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertEqual(data['prediction'], 'FRAUD')
        self.assertTrue(data['is_fraud'])
        self.assertGreaterEqual(data['fraud_probability'], 0.50)

if __name__ == '__main__':
    unittest.main()
