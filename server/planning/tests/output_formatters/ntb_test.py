
import lxml
import unittest

from planning.output_formatters.ntb_event import NTBEventFormatter


class NTBEventTestCase(unittest.TestCase):

    item = {
        'name': 'Kronprinsparet besøker bydelen Gamle Oslo',
        'firstcreated': '2016-10-31T08:27:25+0000',
        'versioncreated': '2016-10-31T09:33:40+0000',
        'dates': {
            'start': '2016-10-31T23:00:00+0000',
            'end': '2016-11-01T22:59:59+0000',
            'tz': 'Europe/Oslo',
        },
        'definition_short': 'Kronprinsparet besøker bydelen Gamle Oslo.',
        'anpa_category': [
            {'qcode': 'o', 'name': 'Innenriks'},
        ],
        'subject': [
            {'qcode': '05001000', 'name': 'adult education', 'parent': '0500000'},
        ],
        'location': [
            {'location': {'lon': 14.4212535, 'lat': 50.0874654}, 'name': 'Prague'},
        ],
    }

    def test_formatter(self):
        formatter = NTBEventFormatter()
        output = formatter.format(self.item, {})[0]
        self.assertIsInstance(output['formatted_item'], str)
        self.assertIsInstance(output['encoded_item'], bytes)

        root = lxml.etree.fromstring(output['encoded_item'])

        self.assertEqual('document', root.tag)
        self.assertEqual('True', root.find('publiseres').text)
        self.assertEqual('newscalendar', root.find('service').text)
        self.assertEqual(self.item['name'], root.find('title').text)
        self.assertEqual('2016-10-31T10:33:40', root.find('time').text)  # utc + 1
        self.assertEqual('NBRP161031_092725_hh_00', root.find('ntbId').text)
        self.assertEqual('Prague', root.find('location').text)
        self.assertEqual('2016-11-01T00:00:00', root.find('timeStart').text)
        self.assertEqual('2016-11-01T23:59:59', root.find('timeEnd').text)
        self.assertEqual('5', root.find('priority').text)
        self.assertEqual(self.item['definition_short'], root.find('content').text)
        self.assertEqual(self.item['anpa_category'][0]['name'], root.find('category').text)
        subjects = root.find('subjects')
        self.assertEqual(1, len(subjects))
        self.assertEqual(self.item['subject'][0]['name'], subjects[0].text)
        geo = root.find('geo')
        self.assertEqual(str(self.item['location'][0]['location']['lat']), geo.find('latitude').text)
        self.assertEqual(str(self.item['location'][0]['location']['lon']), geo.find('longitude').text)

    def test_kill(self):
        item = self.item.copy()
        item['pubstatus'] = 'canceled'
        formatter = NTBEventFormatter()
        output = formatter.format(item, {})[0]
        root = lxml.etree.fromstring(output['encoded_item'])
        self.assertEqual('true', root.get('DeleteRequest'))
